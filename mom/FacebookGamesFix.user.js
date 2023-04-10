// ==UserScript==
// @name         FB Games
// @version      0.1
// @description  Fix Facebook Games Issues
// @author       You
// @match        https://apps.facebook.com/*/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-end
// @grant        none
// ==/UserScript==

var alreadyRunning = false;

function fix( nTimes )
{
    let loc = $( '#containerWrapper div' );

    if( !loc.length && nTimes > 0 )
    {
        console.log( `Fix retries left ${--nTimes}` );

        setTimeout( fix, 1000, nTimes );
        return;
    }

    if( 'hidden' == loc.first().css( 'overflow-y' ) )
    {
        return;
    }

    loc.first().css( { overflowY: 'hidden' } );

    if( !alreadyRunning )
    {
        alreadyRunning = true;

        $( 'body' ).bind( 'DOMSubtreeModified', function() { fix( 10 ); } );
    }
}

fix( 10 );
