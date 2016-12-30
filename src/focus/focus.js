console.log( "=== simpread focus load ===" );

// import css
require( "../assets/css/simpread.css" );

/*
    import
*/
var fcontrol = require( "controlbar" ),
    focus    = ( function () {

    var $parent,
        tag,
        focuscls   = "ks-simpread-focus",
        focusstyle = "z-index: 2147483646; overflow: visible; position: relative;",
        maskcls    = "ks-simpread-mask",
        maskstyle  = "z-index: auto; opacity: 1; overflow: visible; transform: none; animation: none; position: relative;",
        bgcls      = "ks-simpread-bg",
        bgtmpl     = "<div class=" + bgcls + "></div>",
        bgclsjq    = "." + bgcls;

    function Focus() { this.$target = null; }

    /**
     * Add focus mode
     * 
     * @param {jquery} jquery object
     * @param {array}  exclude html array
     * @param {string} background color style
     */
    Focus.prototype.Render = function( $target, exclude, bgcolor ) {
        console.log( "=== simpread focus add ===" );
        this.$target = $target;
        // add focus
        focusStyle( $target, focusstyle, focuscls, "add" );

        // add ks-simpread-mask
        $parent = $target.parent();
        tag     = $parent[0].tagName;
        while ( tag.toLowerCase() != "body" ) {
            focusStyle( $parent, maskstyle, maskcls, "add" );
            $parent = $parent.parent();
            tag     = $parent[0].tagName;
        }

        // add background
        $( "body" ).append( bgtmpl );

        // add background color
        $( bgclsjq ).css({ "background-color" : bgcolor });

        // delete exclude html
        excludeStyle( $target, exclude, "delete" );

        // add control bar
        fcontrol.Render( bgclsjq );

        // click mask remove it
        $( bgclsjq ).on( "click", function( event ) {
            if ( $( event.target ).attr("class") != bgcls ) return;

            // remove focus style
            focusStyle( $target, focusstyle, focuscls, "delete" );

            // add exclude html
            excludeStyle( $target, exclude, "add" );

            // remove control bar
            fcontrol.Remove();

            // remove background
            $( bgclsjq ).off( "click" );
            $( bgclsjq ).remove();

            // remove ks-simpread-mask style
            $parent = $target.parent();
            tag     = $parent[0].tagName;
            while ( tag && tag.toLowerCase() != "body" ) {
                focusStyle( $parent, maskstyle, maskcls, "delete" );
                $parent = $parent.parent();
                tag     = $parent[0].tagName;
            }

            console.log( "=== simpread focus remove ===" );
        });

    }

    /*
        Verify ks-simpread-focus tag exit
    */
    Focus.prototype.Verify = function() {
        if ( $( "body" ).find( "." + focuscls ).length > 0 ) {
            return false;
        } else {
            return true;
        }
    }

    /*
        Set focus style
        @param $target: jquery object
        @param style  : set style string
        @param cls    : set class string
        @param type   : include 'add' and 'delete'
    */
    function focusStyle( $target, style, cls, type ) {
        var bakstyle;
        if ( type === "add" ) {
            bakstyle = $target.attr( "style" ) == undefined ? "" : $target.attr( "style" );
            $target.attr( "style", bakstyle + style ).addClass( cls );
        } else if (  type === "delete" ) {
            bakstyle = $target.attr( "style" );
            bakstyle = bakstyle.replace( style, "" );
            $target.attr( "style", bakstyle ).removeClass( cls );
        }
    }

    /**
     * Hidden style
     * 
     * @param {jquery} jquery object
     * @param {array}  hidden html
     * @param {string} include: 'add' 'delete'
     */
    function excludeStyle( $target, exclude, type ) {
        var i = 0, len = exclude.length,  sel = "";
        for ( i; i < len; i++ ) {
            tag  = htmltag2String( exclude[i] );
            if ( tag ) {
                if ( type == "delete" )   $target.find( tag ).hide();
                else if ( type == "add" ) $target.find( tag ).show();
            }
        }
    }

    return new Focus();

})();

/**
 * Conver html to jquery object
 * 
 * @param  {string} input include html tag, e.g.:
    <div class="article fmt article__content">
 *
 * @return {array} formatting e.g.:
    { "tag" : "class", "name" : "article" }
 * 
 */
function htmltag2String( html ) {
    const item = html.match( / (class|id)=("|')[\w-_]+/ig );
    if ( item && item.length > 0 ) {
        let [tag, name] = item[0].trim().replace( /'|"/ig, "" ).split( "=" );
        if      ( tag == "class" ) name = `.${name}`;
        else if ( tag === "id"   ) name = `#${name}`;
        return name;
    } else {
        return null;
    }
}

module.exports = focus;