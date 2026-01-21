import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Forest {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: "geometry",
    spatialFeatureType: "MultiPolygon",
    srid: 4326
  })
  geom!: object
}
