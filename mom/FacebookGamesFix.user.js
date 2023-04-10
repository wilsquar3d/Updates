// ==UserScript==
// @name         Lexulous
// @version      0.1
// @description  Fix Lexulous Issues
// @author       You
// @match        https://apps.facebook.com/lexulous/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-end
// @grant        none
// ==/UserScript==


function fix( nTimes )
{
    let loc = $( '#containerWrapper div' );

    if( !loc.length && nTimes > 0 )
    {
        console.log( `Fix retries left ${--nTimes}` );

        setTimeout( fix, 1000, nTimes );
        return;
    }

    loc.first().css( { overflowY: 'hidden' } );
}

fix( 10 );
