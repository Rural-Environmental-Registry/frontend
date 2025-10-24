import type { Validation } from '@vuelidate/core'
import type { Ref } from 'vue'

export interface InvalidFieldDetail {
  step: string
  fields: string[]
}

export interface ValidationHelperOptions {
  validation: Ref<Validation>
  formData: any
  getLanguage: (key: string) => string
}

export class ValidationHelper {
  private validation: Ref<Validation>
  private formData: any
  private getLanguage: (key: string) => string

  constructor(options: ValidationHelperOptions) {
    this.validation = options.validation
    this.formData = options.formData
    this.getLanguage = options.getLanguage
  }

  private getFieldDisplayName(fieldKey: string, stepContext: string): string {
    const fieldMappings: { [key: string]: { [field: string]: string } } = {
      registrarDetails: {
        id: this.getLanguage('register.registrarDetails.form.id'),
        dateOfBirth: this.getLanguage('register.registrarDetails.form.dateOfBirth'),
        name: this.getLanguage('register.registrarDetails.form.name'),
        mothersName: this.getLanguage('register.registrarDetails.form.mothersName'),
        'representative.id': `${this.getLanguage('register.registrarDetails.representativeData')} - ${this.getLanguage('register.registrarDetails.form.id')}`,
        'representative.dateOfBirth': `${this.getLanguage('register.registrarDetails.representativeData')} - ${this.getLanguage('register.registrarDetails.form.dateOfBirth')}`,
        'representative.name': `${this.getLanguage('register.registrarDetails.representativeData')} - ${this.getLanguage('register.registrarDetails.form.name')}`,
        'representative.mothersName': `${this.getLanguage('register.registrarDetails.representativeData')} - ${this.getLanguage('register.registrarDetails.form.mothersName')}`,
      },
      landHoldersInformation: {
        id: this.getLanguage('register.landholdersInformation.form.id'),
        dateOfBirth: this.getLanguage('register.landholdersInformation.form.dateOfBirth'),
        name: this.getLanguage('register.landholdersInformation.form.name'),
        mothersName: this.getLanguage('register.landholdersInformation.form.mothersName'),
        legalPersonality: this.getLanguage(
          'register.landholdersInformation.form.landholderLegalPersonality.label',
        ),
        wayToAddLandholdersInformation: this.getLanguage(
          'register.landholdersInformation.form.chooseLandholderInfoMethod.label',
        ),
      },
      ruralProperties: {
        propertyName: this.getLanguage('register.ruralProperty.form.propertyName'),
        state: this.getLanguage('register.ruralProperty.form.state'),
        city: this.getLanguage('register.ruralProperty.form.city'),
        zipCode: this.getLanguage('register.ruralProperty.form.zipCode'),
        'mailingAddress.recipientName': `${this.getLanguage('register.ruralProperty.cardMailingAddress')} - ${this.getLanguage('register.ruralProperty.formMailingAddress.recipientName')}`,
        'mailingAddress.addressStreet': `${this.getLanguage('register.ruralProperty.cardMailingAddress')} - ${this.getLanguage('register.ruralProperty.formMailingAddress.addressStreet')}`,
        'mailingAddress.number': `${this.getLanguage('register.ruralProperty.cardMailingAddress')} - ${this.getLanguage('register.ruralProperty.formMailingAddress.number')}`,
        'mailingAddress.neighborhood': `${this.getLanguage('register.ruralProperty.cardMailingAddress')} - ${this.getLanguage('register.ruralProperty.formMailingAddress.neighborhood')}`,
        'mailingAddress.zipCode': `${this.getLanguage('register.ruralProperty.cardMailingAddress')} - ${this.getLanguage('register.ruralProperty.formMailingAddress.zipCode')}`,
        'mailingAddress.state': `${this.getLanguage('register.ruralProperty.cardMailingAddress')} - ${this.getLanguage('register.ruralProperty.formMailingAddress.state')}`,
        'mailingAddress.city': `${this.getLanguage('register.ruralProperty.cardMailingAddress')} - ${this.getLanguage('register.ruralProperty.formMailingAddress.city')}`,
      },
      propertyRights: {
        propertyLandholding: this.getLanguage('register.propertyRights.form.propertyOrLandholding'),
        registeredPropertyName: this.getLanguage(
          'register.propertyRights.form.registeredPropertyName',
        ),
        area: this.getLanguage('register.propertyRights.form.area'),
        documentType: this.getLanguage('register.propertyRights.form.documentType'),
        titleDeedLandDocument: this.getLanguage(
          'register.propertyRights.form.titleDeedOrLandDocument',
        ),
        documentDate: this.getLanguage('register.propertyRights.form.documentDate'),
        book: this.getLanguage('register.propertyRights.form.book'),
        page: this.getLanguage('register.propertyRights.form.page'),
        stateOfTheNotaryOffice: this.getLanguage(
          'register.propertyRights.form.stateOfTheNotaryOffice',
        ),
        cityOfTheNotaryOffice: this.getLanguage(
          'register.propertyRights.form.cityOfTheNotaryOffice',
        ),
        propertyCertification: this.getLanguage(
          'register.propertyRights.form.propertyCertification',
        ),
        nationalRuralPropertyRegistrationNumber: this.getLanguage(
          'register.propertyRights.form.nationalRuralPropertyRegistrationNumber',
        ),
      },
    }

    return fieldMappings[stepContext]?.[fieldKey] || fieldKey
  }

  getInvalidFieldsDetails(): InvalidFieldDetail[] {
    const invalidFields: InvalidFieldDetail[] = []

    // Check registrarDetails validation
    if (this.validation.value.registrarDetails.$invalid) {
      const fields = Object.keys(this.validation.value.registrarDetails)
        .filter((key) => key !== '$invalid' && this.validation.value.registrarDetails[key].$invalid)
        .map((key) => {
          if (key === 'representative') {
            const repFields = Object.keys(
              this.validation.value.registrarDetails.representative,
            ).filter(
              (repKey) =>
                repKey !== '$invalid' &&
                this.validation.value.registrarDetails.representative[repKey].$invalid,
            )
            return repFields.map((repField) =>
              this.getFieldDisplayName(`representative.${repField}`, 'registrarDetails'),
            )
          }
          return this.getFieldDisplayName(key, 'registrarDetails')
        })
        .flat()

      if (fields.length > 0) {
        invalidFields.push({ step: this.getLanguage('register.registrarDetails.card'), fields })
      }
    }

    // Check landHoldersInformation validation
    if (this.validation.value.landHoldersInformation.$invalid) {
      const fields = Object.keys(this.validation.value.landHoldersInformation)
        .filter(
          (key) => key !== '$invalid' && this.validation.value.landHoldersInformation[key].$invalid,
        )
        .map((key) => this.getFieldDisplayName(key, 'landHoldersInformation'))

      if (fields.length > 0) {
        invalidFields.push({
          step: this.getLanguage('register.landholdersInformation.card'),
          fields,
        })
      }
    }

    // Check ruralProperties validation
    if (this.validation.value.ruralProperties.$invalid) {
      const fields = Object.keys(this.validation.value.ruralProperties)
        .filter((key) => key !== '$invalid' && this.validation.value.ruralProperties[key].$invalid)
        .map((key) => {
          if (key === 'mailingAddress') {
            const mailFields = Object.keys(
              this.validation.value.ruralProperties.mailingAddress,
            ).filter(
              (mailKey) =>
                mailKey !== '$invalid' &&
                this.validation.value.ruralProperties.mailingAddress[mailKey].$invalid,
            )
            return mailFields.map((mailField) =>
              this.getFieldDisplayName(`mailingAddress.${mailField}`, 'ruralProperties'),
            )
          }
          return this.getFieldDisplayName(key, 'ruralProperties')
        })
        .flat()

      if (fields.length > 0) {
        invalidFields.push({ step: this.getLanguage('register.ruralProperty.card'), fields })
      }
    }

    // Check propertyRights validation
    if (this.validation.value.propertyRights.$invalid) {
      const fields = Object.keys(this.validation.value.propertyRights)
        .filter((key) => key !== '$invalid' && this.validation.value.propertyRights[key].$invalid)
        .map((key) => this.getFieldDisplayName(key, 'propertyRights'))

      if (fields.length > 0) {
        invalidFields.push({ step: this.getLanguage('register.propertyRights.card'), fields })
      }
    }

    // Check if landholders data is missing
    if (
      !this.formData.landHoldersInformation?.landHoldersData ||
      this.formData.landHoldersInformation.landHoldersData.length === 0
    ) {
      invalidFields.push({
        step: this.getLanguage('register.landholdersInformation.card'),
        fields: [this.getLanguage('register.landholdersInformation.warningModal')],
      })
    }

    // Check if property rights documents are missing
    if (
      !this.formData.propertyRights?.propertyRightsData ||
      this.formData.propertyRights.propertyRightsData.length === 0
    ) {
      invalidFields.push({
        step: this.getLanguage('register.propertyRights.card'),
        fields: [this.getLanguage('register.propertyRights.invalidForm')],
      })
    }

    return invalidFields
  }

  buildValidationMessage(invalidFields: InvalidFieldDetail[]): string {
    if (invalidFields.length === 0) return ''

    let detailedMessage =
      this.getLanguage('register.propertyRights.validationError.header') + '\n\n'

    invalidFields.forEach((stepInfo) => {
      detailedMessage += `${this.getLanguage('register.propertyRights.validationError.step')}: ${stepInfo.step}\n`
      detailedMessage += `${this.getLanguage('register.propertyRights.validationError.fields')}: ${stepInfo.fields.join(', ')}\n\n`
    })

    detailedMessage += this.getLanguage('register.propertyRights.validationError.instruction')

    return detailedMessage
  }

  getPropertyRightsInvalidFields(): string[] {
    return Object.keys(this.validation.value.propertyRights)
      .filter((key) => key !== '$invalid' && this.validation.value.propertyRights[key].$invalid)
      .map((key) => this.getFieldDisplayName(key, 'propertyRights'))
  }
}
