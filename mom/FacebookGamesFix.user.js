// ==UserScript==
// @name         FB Games
// @version      0.2
// @description  Fix Facebook Games Issues
// @author       You
// @match        https://apps.facebook.com/*/*
// @match        https://aws.rjs.in/fblexulous/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

var alreadyRunning = false;
var data = {};
var dataPages = {
    lexulous: { delay: 1000 }
};

function startup()
{
    fix( 10 );

    let func = null;
    for( let page of Object.keys( dataPages ) )
    {
        if( window.location.href.includes( page ) )
        {
            data = GM_getValue( 'data', {} );
            func = page;
            console.log( data );
        }
    }

    if( func )
    {
        eval( `${func}()` );
    }
}

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

function lexulous()
{
    /*
        TODO
        - split list at selected game (not starting at first game)
        - play => next button update
    */

    if( window.location.href.includes( 'apps.facebook' ) ) // runs in iframe
        return;

    if( $( '#wrapper' ).length )
    {
        if( $( 'a:contains("Next Game")' ).length ) // game
        {
            let lnk = $( 'a:contains("Next Game")' );
            let next = data.lexulous.games.shift();
            lnk.attr( 'href', next );

            data.lexulous.games.push( next );
            GM_setValue( 'data', data );

            return;
        }

        // games list
        let gameData = [];
        let games = $( 'div.user_detailsrow' );
        $.each( games, function( ndx, val ) {
            let elem = $( val ).find( 'div[onclick*="viewboard"]' );
            if( elem.length && elem.text().includes( 'Your Turn' ) )
                gameData.push( $( elem ).attr( 'onclick' ).split( 'changePage(\'' )[1].split( '\');' )[0].trim() );
        } );

        if( gameData.length )
        {
            gameData.push( gameData.shift() ); // temp move first to last
            data.lexulous = data.lexulous || {};
            data.lexulous.games = gameData;
            GM_setValue( 'data', data );

            return;
        }
    }

    setTimeout( lexulous, dataPages.lexulous.delay );
}

startup();
