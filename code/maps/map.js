export default {
    "backgroundcolor":"#9a9a9a",
    "compressionlevel":-1,
    "editorsettings":
        {
            "export":
                {
                    "target":"."
                }
        },
    "height":12,
    "infinite":false,
    "layers":[
        {
            "data":[0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  0,
                    0,   0, 181,   0, 181,   0,   0, 181,   0,   0, 181,  0,
                    0,   0, 181,   0,   0, 181,   0, 181,   0,   0,   0,  0,
                  181, 181, 181, 181,   0,   0,   0, 181, 181, 181,   0,  0,
                    0,   0,   0,   0,   0, 181,   0,   0, 181,   0,   0,  0,
                    0, 181, 181, 181,   0, 181,   0,   0, 181,   0,   0,  0,
                    0,   0,   0, 181,   0, 181,   0,   0, 181, 181, 181, 181,
                    0,   0,   0,   0,   0, 181,   0,   0,   0,   0,   0,   0,
                  181, 181, 181,   0,   0, 181, 181, 181, 181, 181,   0,   0,
                    0,   0,   0,   0, 181, 181,   0,   0,   0, 181,   0,   0,
                  181,   0,   0,   0,   0, 181,   0,   0,   0, 181,   0,   0,
                    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
            "height":12,
            "id":1,
            "name":"walls",
            "opacity":1,
            "type":"tilelayer",
            "visible":true,
            "width":12,
            "x":0,
            "y":0
        },
        {
            "draworder":"topdown",
            "id":3,
            "name":"tanks",
            "objects":[
                {
                    "ellipse":true,
                    "height":46,
                    "id":1,
                    "name":"playerTank",
                    "rotation":0,
                    "type":"tank",
                    "visible":true,
                    "width":42,
                    "x":398,
                    "y":588.753539019964
                }],
            "opacity":1,
            "type":"objectgroup",
            "visible":true,
            "x":0,
            "y":0
        }],
    "nextlayerid":4,
    "nextobjectid":4,
    "orientation":"orthogonal",
    "renderorder":"right-down",
    "tiledversion":"1.3.1",
    "tileheight":64,
    "tilesets":[
        {
            "columns":23,
            "firstgid":1,
            "image":"../resources/tilesheet.png",
            "imageheight":832,
            "imagewidth":1472,
            "margin":0,
            "name":"tilesheet",
            "spacing":0,
            "tilecount":299,
            "tileheight":64,
            "tilewidth":64
        }],
    "tilewidth":64,
    "type":"map",
    "version":1.2,
    "width":12
}