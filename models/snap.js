export class Snap {
  constructor(
    title,
    description,
    imageUri,
    address,
    latitude,
    longitude,
    createdAt
  ) {
    this.id = new Date().getTime();
    this.title = title;
    this.description = description;
    this.imageUri = imageUri;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.createdAt = createdAt;
  }
}
