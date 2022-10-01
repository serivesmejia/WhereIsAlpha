import * as THREE from 'three'

export const earth_r = 6378;

export function calculate_position_from(latitude, longitude, separation, sphere_radius) {
    let lat = THREE.MathUtils.degToRad(latitude)
    let lon = THREE.MathUtils.degToRad(longitude)

    let x = earth_r * Math.cos(lat) * Math.cos(lon)
    let y = earth_r * Math.cos(lat) * Math.sin(lon)
    let z = earth_r * Math.sin(lat)

    let conversion = sphere_radius / earth_r

    return new THREE.Vector3(
        y * conversion,
        z * conversion,
        x * conversion + (Math.sign(x) * separation)
    )
}