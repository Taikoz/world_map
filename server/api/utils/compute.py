def flatten_coords(geom):
    """Recursively extract coordinates from any GEOSGeometry."""
    coords = []

    if geom.geom_type == 'Point':
        coords.extend([geom.x, geom.y])
    elif geom.geom_type in ['LineString', 'Polygon']:
        for c in geom.coords:
            if isinstance(c[0], (float, int)):
                coords.extend(c)
            else:  # handle Polygon with interior rings
                for subc in c:
                    coords.extend(subc)
    elif geom.geom_type.startswith('Multi') or geom.geom_type == 'GeometryCollection':
        for g in geom:  # iterate over sub-geometries
            coords.extend(flatten_coords(g))
    else:
        raise ValueError(f"Unsupported geometry type: {geom.geom_type}")

    return coords

def compute_embedding_from_geom(geom, dim=1536):
    
    coords = flatten_coords(geom)
    embedding = coords[:dim]  # truncate
    embedding += [0] * (dim - len(embedding))  # pad
    return embedding