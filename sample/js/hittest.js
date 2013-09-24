/**
 *
 * Created with JetBrains WebStorm.
 *
 * Code     : PNG HitTest JS
 * Version  : 1.0
 *
 * User     : Bugra OZDEN
 * Site     : http://www.bugraozden.com
 * Mail     : bugra.ozden@gmail.com
 *
 * Date     : 10 Oct 2012
 * Time     : 6:22 AM
 *
 */

function HitTest( objectSource ){

    this.objectSource = objectSource;
    this.objectMatrix = HitTest.getMatrix( objectSource );
    this.objectCoordinates = HitTest.getBorderCoordinates( objectSource, this.objectMatrix );

}

HitTest.COORDINATE_SPACE = 2;

HitTest.prototype.objectSource;
HitTest.prototype.objectCoordinates;
HitTest.prototype.objectMatrix;

HitTest.areaSource;
HitTest.areaMatrix;

HitTest.prototype.toArea = function( areaSource ){

    isHit = 0;

    if( HitTest.areaMatrix == null || areaSource != HitTest.areaSource ){

        HitTest.areaSource = areaSource;
        HitTest.areaMatrix = HitTest.getMatrix( areaSource );

    }

    for( var i = 0; i < this.objectCoordinates.length; i++ ){

            var areaData = HitTest.areaMatrix.getImageData( this.objectCoordinates[i].x + this.objectSource.x - areaSource.x,
                this.objectCoordinates[i].y + this.objectSource.y - areaSource.y,
                1,
                1 );

            if( areaData.data[3] != 0 ){

                isHit = 1;
                break;
            }
    }

    return isHit;

};

HitTest.prototype.toObject = function( secondObjectSource ){

    isHit = 0;

    var secondObjectMatrix = HitTest.getMatrix( secondObjectSource );

    var secondObjectX2 = parseInt( secondObjectSource.x + secondObjectSource.width );
    var secondObjectY2 = parseInt( secondObjectSource.y + secondObjectSource.height );

    var checkObject = function( objectSource ) {

        if( objectSource.x >= secondObjectSource.x - objectSource.width &&
            objectSource.x <= secondObjectX2 &&
            objectSource.y >= secondObjectSource.y - objectSource.height &&
            objectSource.y <= secondObjectY2 ){

            return 1;

        }else{

            return 0;

        }

    }

    if( checkObject( this.objectSource ) == 1 ) {

        for( var i = 0; i < this.objectCoordinates.length; i++ ){

            var xCor = this.objectSource.x + this.objectCoordinates[i].x;
            var yCor = this.objectSource.y + this.objectCoordinates[i].y;

            var secondObjectRealX = xCor - secondObjectSource.x;
            var secondObjectRealY = yCor - secondObjectSource.y;

            if( secondObjectRealX < 1 ||
                secondObjectRealY < 1 ||
                secondObjectRealX >= secondObjectSource.width ||
                secondObjectRealY >= secondObjectSource.height ) {

                //out

            }else{

                var secondObjectData = secondObjectMatrix.getImageData( secondObjectRealX, secondObjectRealY, 1, 1 );

                if( secondObjectData.data[3] != 0 ){

                    isHit = 1;
                    break;

                }
            }
        }

    }

    return isHit;

};


HitTest.mouseToObject = function( mouseX, mouseY, objectSource ){


    isHit = 0;

    if( mouseX >= objectSource.x &&
        mouseX <= objectSource.x + objectSource.width &&
        mouseY >= objectSource.y &&
        mouseY <= objectSource.y + objectSource.height ) {

        var objectMatrix = HitTest.getMatrix( objectSource );
        var objectData = objectMatrix.getImageData( mouseX - objectSource.x , mouseY - objectSource.y , 1, 1 );

        if( objectData.data[3] != 0 ) {
            isHit = 1;
        }

    }

    return isHit;

};

HitTest.mouseToArea = function( mouseX, mouseY, areaSource ){

    var isHit = 0;

    if( HitTest.areaMatrix == null || areaSource != HitTest.areaSource ){

        HitTest.areaSource = areaSource;
        HitTest.areaMatrix = HitTest.getMatrix( areaSource );

    }

    var areaData = HitTest.areaMatrix.getImageData( mouseX - areaSource.x , mouseY - areaSource.y , 1, 1 );

    if( areaData.data[3] != 0 ) {
        isHit =  1;
    }

    return isHit;

};

HitTest.getBorderCoordinates = function( objectSource, objectMatrix, coordinateSpace ){

    var objectMatrix = ( objectMatrix ) ? objectMatrix : HitTest.getMatrix( objectSource );
    var coordinates = [];

    var space = ( coordinateSpace ) ? coordinateSpace : HitTest.COORDINATE_SPACE;

    for( var i = 1; i < objectSource.height; i += space ){

        for( var j = 1; j < objectSource.width; j += space ){

            var objectData = objectMatrix.getImageData( j, i, 1, 1 );

            if( objectData.data[3] != 0 ){

                if( i == 1 ||
                    j == 1 ||
                    i == objectSource.height - 1 ||
                    j == objectSource.width - 1 ){

                    coordinates.push( { 'x': j, 'y': i } );

                }else{

                    var up = objectMatrix.getImageData( j, i - 1 , 1, 1 );
                    var down = objectMatrix.getImageData( j, i + 1 , 1, 1 );
                    var right = objectMatrix.getImageData( j + 1, i , 1, 1 );
                    var left = objectMatrix.getImageData( j - 1, i , 1, 1 );

                    if( up.data[3] == 0 ||
                        down.data[3] == 0 ||
                        right.data[3] == 0 ||
                        left.data[3] == 0 ){

                        coordinates.push( { 'x': j, 'y': i } );

                    }

                }

            }

        }

    }

    return coordinates;

};

HitTest.getMatrix = function( imgSource ){

    var canvas = document.createElement("canvas");

    canvas.setAttribute( 'width', imgSource.width );
    canvas.setAttribute( 'height', imgSource.height );

    var objectMatrix = canvas.getContext( "2d" );
    objectMatrix.drawImage( imgSource, 0, 0 );

    return objectMatrix;

};