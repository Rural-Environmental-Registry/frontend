import * as turf from '@turf/turf'
import diffArea from '@/config/diff_area.json'
const PROPERTY_CODE = diffArea.layer_code

import { processLayerService } from '@/services/calculationEngineService'

export default class MapHandler {
  private readonly _map
  private readonly _leaflet
  private readonly _drawItemsGroup
  private readonly _closeCoordinatePanel
  private readonly _handlerCallback

  constructor(mapRef: any, handlerCallback: any) {
    this._map = mapRef.map
    this._leaflet = mapRef.leaflet
    this._drawItemsGroup = mapRef.drawItemsGroup
    this._closeCoordinatePanel = mapRef.closeCoordinatePanel
    this._handlerCallback = handlerCallback

    this.init()
  }

  // PRIVATE METHODS

  /* Controls and tools */
  private init(): void {
    this.addPositionControl()
    this.addCustomControlSlot()
    this.blockSelfIntersection()
    this.attachPmCursorHandlers()
  }

  private createCustomMarker(drawStyle: any): any {
    if (!drawStyle.icon) return

    const { icon, color = '#000000' } = drawStyle

    return this._leaflet.divIcon({
      className: 'custom-div-icon',
      html: `<div style="color: ${color};"><i class="${icon}"/></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
  }

  private setCustomMarker(drawStyle: any): void {
    const customMarker = this.createCustomMarker(drawStyle)

    if (!customMarker) return

    this._map.pm.setGlobalOptions({ markerStyle: { icon: customMarker } })
  }

  private addCustomControlSlot() {
    const CustomControlSlot = this._leaflet.Control.extend({
      options: {
        position: 'topright',
      },
      onAdd: () => {
        return this._leaflet.DomUtil.create(
          'div',
          'leaflet-control-layers leaflet-control leaflet-control-custom d-none',
        )
      },
    })

    this._map.addControl(new CustomControlSlot())
  }

  private blockSelfIntersection(): void {
    this._map.pm.setGlobalOptions({ allowSelfIntersection: false })
  }

  private attachPmCursorHandlers(): void {
    const container = () => this._map.getContainer()

    this._map.on('pm:drawstart', () => {
      const el = container()
      if (el) el.style.cursor = 'crosshair'
    })

    const resetCursor = () => {
      const el = container()
      if (el) el.style.cursor = ''
    }

    this._map.on('pm:drawend', resetCursor)
    this._map.on('pm:drawcancel', resetCursor)
    this._map.on('pm:remove', resetCursor)
  }

  private getCustomContainer(): any {
    const controlContainer = this._map.getContainer().querySelector('.leaflet-control-custom')
    controlContainer.classList.remove('d-none')

    return controlContainer
  }

  private addCentralizationControl(bounds: any): void {
    const CentralizationControl = this._leaflet.Control.extend({
      options: {
        position: 'topright',
      },
      onAdd: () => {
        const controlContainer = this.getCustomContainer()
        const btn = this._leaflet.DomUtil.create(
          'button',
          'w-8 h-8 centralization-btn hover:bg-gray-200 rounded-[10px]',
          controlContainer,
        )

        btn.innerHTML = '<i class="fa fa-crosshairs text-gray-600"/>'
        btn.style.cursor = 'pointer'
        btn.style.textAlign = 'center'

        this._leaflet.DomEvent.on(btn, 'click', (e: any) => {
          e.stopPropagation()
          e.preventDefault()
          if (bounds) {
            this._map.fitBounds(bounds)
          }
        })
        return controlContainer
      },
    })

    this._map.addControl(new CentralizationControl())
  }

  private addCentralizationButton(layer: any): void {
    const layerId = layer._leaflet_id
    const bounds = this._drawItemsGroup.getLayer(layerId).getBounds()
    this.addCentralizationControl(bounds)
  }

  private addPositionControl(): void {
    const scaleControl = this._leaflet.control.scale({ metric: true, imperial: false })
    this._map.addControl(scaleControl)

    const PositionControl = this._leaflet.Control.extend({
      options: {
        position: 'bottomright',
      },
      onAdd: (map: any) => {
        const scaleContainter = this._map
          .getContainer()
          .querySelector('.leaflet-control-scale-line')
        scaleContainter.style.display = 'none'

        const latLngContainer = this._leaflet.DomUtil.create(
          'div',
          'leaflet-footer-control flex items-center bg-white p-2 rounded-md d-none mr-2 mb-4',
        )

        const state = {
          lat: 0,
          lng: 0,
          zoom: map.getZoom(),
          scale: scaleContainter.innerHTML,
        }

        const mapStateText = () => {
          latLngContainer.innerHTML = `
          <span class="text-gray-600 flex items-center gap-2 flex-wrap">
            <span><span class="font-bold">Lat: </span>${state.lat.toFixed(5)}</span>
            <span><span class="font-bold">Lng: </span>${state.lng.toFixed(5)}</span>
            <span><span class="font-bold">Zoom: </span>${state.zoom}</span>
            <span><span class="font-bold">Scale: </span>${state.scale}</span>
          </span>`

          latLngContainer.classList.remove('d-none')
        }

        map.on('mousemove', (e: any) => {
          const { lat, lng } = e.latlng
          state.lat = lat
          state.lng = lng
          mapStateText()
        })

        map.on('zoomend', () => {
          state.scale = scaleContainter.innerHTML
          state.zoom = map.getZoom()
          mapStateText()
        })

        return latLngContainer
      },
    })

    this._map.addControl(new PositionControl())
  }

  private finishDrawing(rules: any): void {
    if (rules.maxInstances === 1) {
      const finishButton = this._map
        .getContainer()
        .querySelector('.leaflet-pm-action.pos-right.action-cancel')
      finishButton?.click()
    }
  }

  private toggleTools(data: any): void {
    const toolsContainer = this._map.getContainer().querySelector('.leaflet-pm-draw')
    toolsContainer.style.display = 'flex'
    toolsContainer.style.flexDirection = 'column'

    if (data.rules?.maxInstances === 1 && data.vectorizedArea) {
      toolsContainer.style.display = 'none'
    }
  }

  private removeCentralizationButton(): void {
    const centralizationButton = this._map.getContainer().querySelector('.centralization-btn')
    this._leaflet.DomUtil.remove(centralizationButton)
  }

  /* Map rules */
  private matchLayers(processedLayers: any, vectorizedLayers: any): any {
    for (const key in vectorizedLayers) {
      vectorizedLayers[key].vectorizedArea = null
    }

    this._drawItemsGroup.clearLayers()

    processedLayers.forEach((lyr: any) => {
      const opts = vectorizedLayers[lyr.properties.layerCode]
      if (!opts) return
      const options = {
        layerCode: opts.layerCode,
        rules: opts.rules,
        restored: true,
        ...opts.rules.style,
      }

      const layer = this._leaflet.geoJson(lyr, options)

      const appliedLayer = this.applyLayerToMap(layer)

      if (layer.options.layerCode === PROPERTY_CODE) {
        this._map.fitBounds(appliedLayer.getBounds())
      }

      let buffer = null
      if (options.rules?.buffer) {
        buffer = processedLayers.find(
          (l: any) => l.properties.layerCode === options.rules.buffer.layerCode,
        )
      }

      vectorizedLayers[lyr.properties.layerCode].vectorizedArea = this.processAppliedLayer(
        appliedLayer,
        buffer,
      )
    })

    return vectorizedLayers
  }

  private async processLayerFromCalculationEngine(vectorizedLayers: any) {
    try {
      const layers = this._drawItemsGroup.getLayers().map((layer: any) => {
        const layerJson = this.getJsonFeatures(layer)
        layerJson.properties = {
          ...layer.options,
          tipo: layer.options.layerCode,
          nome: layer.options.displayName,
        }
        return layerJson
      })

      const { features, removedLayers } = await processLayerService(layers)

      if (removedLayers.length) {
        this._handlerCallback({ event: 'notifyRemovedLayers', removedLayers })
      }

      return this.matchLayers(features, vectorizedLayers)
    } catch (error) {
      throw error
    }
  }

  private addBuffer(rules: any, bufferJson: any): void {
    this.addUpdatedLayer(this._leaflet.geoJson(bufferJson, { ...rules }))
  }

  private getJsonFeatures(layer: any): any {
    let features = layer.toGeoJSON()

    if (features.type === 'FeatureCollection') {
      features = features.features[0]
    }

    return features
  }

  private buildLayerToDraw(layer: any, propertyInfo: any): any {
    let copyLayer = layer

    const isMemorial = layer?.options?.memorialKey

    copyLayer.options.layerCode = propertyInfo.layerCode
    copyLayer.options.rules = propertyInfo.rules

    if (isMemorial) {
      copyLayer.options = {
        ...copyLayer.options,
        ...propertyInfo.rules.style,
      }

      copyLayer = this._leaflet.geoJson(copyLayer.toGeoJSON(), copyLayer.options)
    }
    return copyLayer
  }

  private applyLayerToMap(layer: any): any {
    const layerJson = this.getJsonFeatures(layer)
    const { type } = layerJson.geometry
    const layerOptions = { ...layer.options }

    const isPolyAllowed = type === 'MultiPolygon' && layerOptions.rules.geometryType === 'Polygon'
    const isSameType = type === layerOptions.rules.geometryType
    if (!isSameType && !isPolyAllowed) {
      this._handlerCallback({ event: 'mapErrors', error: { errorType: 'invalidType' } })
      throw new Error('invalid type')
    }

    const shapesWithArea = ['Polygon', 'MultiPolygon']
    if (shapesWithArea.includes(type)) {
      if (this.calculateAreas(layerJson) === 0) {
        this._handlerCallback({ event: 'mapErrors', error: { errorType: 'invalidPolygon' } })
        throw new Error('invalid polygon')
      }
    }

    const preparedLayerTypes: any = {
      LineString: 'LineString',
      Polygon: 'Polygon',
      MultiPolygon: 'MultiPolygon',
      Point: 'Point',
    }

    if (!preparedLayerTypes[type]) {
      this.addUpdatedLayer(layer)
      return layer
    }

    if (preparedLayerTypes[type] === 'Point') {
      // used to redraw the icon when restored from state
      if ((layerOptions.restored || layerOptions.memorialKey) && layer.options?.rules?.style) {
        const customMarker = this.createCustomMarker(layer.options.rules.style)
        layer = this._leaflet.geoJson(layerJson, {
          pointToLayer: (feature: any, latlng: any) => {
            return this._leaflet.marker(latlng, {
              icon: customMarker,
            })
          },
          ...layerOptions,
        })
      }

      this.addUpdatedLayer(layer)
      return layer
    }

    const newFormattedLayer = this._leaflet.geoJson(layerJson, layerOptions)
    const layers = newFormattedLayer.getLayers()

    layers.forEach((lyr: any) => {
      const geom = lyr.feature.geometry

      if (geom.type === 'MultiPolygon') {
        geom.coordinates.forEach((coord: any) => {
          const poly = { type: 'Polygon', coordinates: coord }

          this._leaflet.geoJson(poly, {
            ...layer.options,
            onEachFeature: (_: any, cLayer: any) => {
              this.watchUpdatedlayer(cLayer)
            },
          })
        })
      }
    })

    this.addUpdatedLayer(newFormattedLayer)
    return newFormattedLayer
  }

  private addUpdatedLayer(layer: any): void {
    this._drawItemsGroup.addLayer(layer)
    this.watchUpdatedlayer(layer)
  }

  private watchUpdatedlayer(layer: any): void {
    layer.on('pm:update', (evt: any) => {
      const editedLayer = evt.layer
      const copyLayer = this.buildLayerToDraw(editedLayer, layer.options)
      const isPropertyLayer = copyLayer.options?.layerCode === PROPERTY_CODE

      const appliedLayer = this.applyLayerToMap(copyLayer)

      const generateDuplicates = copyLayer.options.rules.geometryType !== 'Point'
      if (generateDuplicates) {
        this._drawItemsGroup.removeLayer(layer)
      }

      const newLayer = this.processAppliedLayer(appliedLayer)

      if (copyLayer.options?.rules?.buffer) {
        const { layerCode } = copyLayer.options.rules.buffer

        newLayer.buffer = null
        this._drawItemsGroup.eachLayer((lyr: any) => {
          if (lyr.options?.layerCode === layerCode) {
            this._drawItemsGroup.removeLayer(lyr)
          }
        })
      }

      this._handlerCallback({ event: 'updatedLayer', layer: newLayer })
      this._handlerCallback({ event: 'changedState' })

      if (isPropertyLayer) {
        this.removeCentralizationButton()
        this._drawItemsGroup.removeLayer(editedLayer)
        this._drawItemsGroup.removeLayer(appliedLayer)
        this._handlerCallback({ event: 'refreshMap' })
      }
    })
  }

  private calculateAreas(layerJson: any): number {
    let drawnArea = 0

    if (layerJson.geometry.type === 'Polygon') {
      drawnArea = turf.area(layerJson)
    }

    if (layerJson.geometry.type === 'MultiPolygon') {
      layerJson.geometry.coordinates.forEach((coord: any) => {
        drawnArea += turf.area({ type: 'Polygon', coordinates: coord })
      })
    }

    return drawnArea
  }

  private calculateAreasAndLenghts(layerJson: any): any {
    const drawnArea = this.calculateAreas(layerJson)

    const calculatedLength = {
      m: 0,
      km: 0,
    }

    if (layerJson.geometry.type === 'LineString') {
      const drawnLength = turf.length(layerJson, { units: 'kilometers' })

      calculatedLength.m = drawnLength * 1000
      calculatedLength.km = drawnLength
    }

    const calculatedArea = {
      m2: drawnArea,
      km2: drawnArea / 1000000,
      ha: layerJson.properties?.area || drawnArea / 10000,
    }

    const areas = {
      m2: {
        value: calculatedArea.m2,
        formatted: `${calculatedArea.m2.toFixed(2)} m²`,
      },
      km2: {
        value: calculatedArea.km2,
        formatted: `${calculatedArea.km2.toFixed(2)} km²`,
      },
      ha: {
        value: calculatedArea.ha,
        formatted: `${calculatedArea.ha.toFixed(2)} ha`,
      },
    }

    const lengths = {
      m: {
        value: calculatedLength.m,
        formatted: `${calculatedLength.m.toFixed(2)} m`,
      },
      km: {
        value: calculatedLength.km,
        formatted: `${calculatedLength.km.toFixed(2)} km`,
      },
    }

    return { ...areas, ...lengths }
  }

  private processAppliedLayer(appliedLayer: any, buffer: any = null): any {
    if (!appliedLayer) return

    const layerData = {
      geoJson: null,
      options: null,
      buffer,
      info: null,
      layer: appliedLayer,
    }

    const layerJson = this.getJsonFeatures(appliedLayer)

    layerData.geoJson = layerJson
    layerData.options = appliedLayer.options
    layerData.info = this.calculateAreasAndLenghts(layerJson)

    if (buffer && appliedLayer.options?.rules?.buffer) {
      this.addBuffer(appliedLayer.options.rules.buffer, buffer)
    }

    return layerData
  }

  // PUBLIC METHODS

  public processDrawingFromMapEvent(evt: any, propertyInfo: any): any {
    const { layer, type } = evt

    const isMemorial = layer?.options?.memorialKey

    // edited and deleted events are handed in different ways
    if (type === 'created') {
      const copyLayer = this.buildLayerToDraw(layer, propertyInfo)
      const { rules, layerCode } = copyLayer.options

      this._drawItemsGroup.removeLayer(layer)

      const appliedLayer = this.applyLayerToMap(copyLayer)

      if (layerCode === PROPERTY_CODE) this.addCentralizationButton(appliedLayer)

      if (!isMemorial) {
        this.finishDrawing(rules)
      } else {
        this._closeCoordinatePanel()
      }

      this._handlerCallback({ event: 'changedState' })

      return this.processAppliedLayer(appliedLayer)
    }
  }

  public processDrawingFromState(data: any): any {
    const { geoJson, options, buffer } = data

    options.restored = true
    const layer = this._leaflet.geoJson(geoJson, options)

    const appliedLayer = this.applyLayerToMap(layer)

    if (layer.options.layerCode === PROPERTY_CODE) {
      this.addCentralizationButton(appliedLayer)
    }

    return this.processAppliedLayer(appliedLayer, buffer)
  }

  public updateLanguage(lang: string): void {
    type SystemLanguages = 'en-us' | 'pt-br' | 'es-es'

    const langs = {
      'en-us': 'en',
      'pt-br': 'pt_br',
      'es-es': 'es',
    }
    this._map.pm.setLang(langs[lang as SystemLanguages])
  }

  public displayTools(data: any): void {
    if (!data?.drawTools?.length) {
      this._map.pm.removeControls()
      return
    }

    const availableTools: any = {
      polygon: 'drawPolygon',
      circle: 'drawCircle',
      circleMarker: 'drawCircleMarker',
      polyline: 'drawPolyline',
      rectangle: 'drawRectangle',
      marker: 'drawMarker',
    }

    const toolsToDisplay: any = {
      drawPolygon: false,
      drawCircle: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawMarker: false,
    }

    data.drawTools.forEach((tool: any) => {
      toolsToDisplay[availableTools[tool]] = !!availableTools[tool]
    })

    this._map.pm.addControls(toolsToDisplay)

    if (data.rules?.style) {
      this._map.pm.setPathOptions(data.rules.style, { merge: true })
      this.setCustomMarker(data.rules.style)
    }
  }

  public handleDrawingControls(data: any): void {
    this.toggleTools(data)
  }

  public toggleLayerVisibility(layer: any): any {
    if (layer.layerCode === PROPERTY_CODE) return
    const foundLayer = this._drawItemsGroup.getLayer(layer.vectorizedArea.layer._leaflet_id)

    if (foundLayer) {
      this._drawItemsGroup.eachLayer((lyr: any) => {
        if (
          lyr.options?.layerCode === layer.layerCode ||
          lyr.options?.layerCode === layer.rules?.buffer?.layerCode
        ) {
          this._drawItemsGroup.removeLayer(lyr)
        }
      })

      return
    }

    return this.processAppliedLayer(
      this.applyLayerToMap(layer.vectorizedArea.layer),
      layer.vectorizedArea.buffer,
    )
  }

  public removeLayer(layer: any): void {
    let isPropertyRemoved = false

    if (layer.layerCode === PROPERTY_CODE) {
      this.removeCentralizationButton()
      isPropertyRemoved = true
    }

    if (isPropertyRemoved) {
      this._drawItemsGroup.eachLayer((lyr: any) => {
        if (lyr.options?.layerCode || lyr.options?.layerCode) {
          this._drawItemsGroup.removeLayer(lyr)
        }
      })
    }

    if (layer.rules?.buffer) {
      this._drawItemsGroup.eachLayer((lyr: any) => {
        if (lyr.options?.layerCode === layer.rules.buffer.layerCode) {
          this._drawItemsGroup.removeLayer(lyr)
        }
      })
    }

    this._drawItemsGroup.removeLayer(layer.vectorizedArea.layer)

    this._handlerCallback({ event: 'changedState' })
  }

  public editLayer(layer: any): void {
    const layerId = layer.vectorizedArea.layer._leaflet_id
    const layerToEdit = this._drawItemsGroup.getLayer(layerId)

    if (layer.isEditing) {
      layerToEdit.pm.enable()
    } else {
      layerToEdit.pm.disable()
    }
  }

  public centralizeMap(): void {
    const btn = this._map.getContainer().querySelector('.centralization-btn')
    btn?.click()
  }

  public async processLayersOnAPI(vectorizedLayers: any): Promise<any> {
    return await this.processLayerFromCalculationEngine(vectorizedLayers)
  }
}
