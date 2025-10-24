export type BaseDetails = {
  id: string
  dateOfBirth: string
  name: string
  mothersName: string
}

export type RegistrarDetails = BaseDetails & {
  representative?: RepresentativeDetails
}

export type RepresentativeDetails = BaseDetails
