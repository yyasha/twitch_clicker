var true_check = false;
let count;
setTimeout(count = 0)
setTimeout(chrome.runtime.sendMessage({message:count.toString()}))

// Finds the right element, clicks the bonus button
function clickPoints() {
    //console.log('Element detected.')

    // Get all clickable buttons inside 'community-points-summary'
    var elems = document.querySelector('.community-points-summary').querySelectorAll('button');

    // Click each button, except for the first, which is the points spending menu
    elems.forEach(function(currentElem, index, arr) {
        if (index != 0) {
            // Click the button and display the console log
            console.log('Twitch Points Autoclicker: Clicked!');
            currentElem.click();

            count = count + 1;
            console.log(count)
            chrome.runtime.sendMessage({message:count.toString()});
        }
    });
}

// Check if user is opted into hiding bonus chests and hide them accordingly
function hideBonusPointsSection() {
    chrome.storage.sync.get({
        hideBonusChests: false,
    }, function(items) {
        var hideBonusChests = items.hideBonusChests;

        if (hideBonusChests) {
            var value = "none";
        } else {
            var value = "block";
        }

        if (document.body.contains(document.getElementsByClassName('community-points-summary')[0])) {
            // Chests themselves
            document.getElementsByClassName('community-points-summary')[0].children[1].style.display = value;
            // Floaty +50 text
            document.getElementsByClassName('community-points-summary')[0].children[0].children[3].style.display = value;
        }
    });
}

function checkPage() {
    // Prevent firing script upon simultaneous redirects and fast page switching
    if (!true_check) {
        return
    }
    true_check = false;

    Arrive.unbindAllArrive();

    if (document.body.contains(document.getElementsByClassName('community-points-summary')[0])) {
        // Presumably on a channel page that already contains the points section div
        console.log('Detected inside of a channel page.');

        // Pre-check
        clickPoints();

        hideBonusPointsSection();

        document.getElementsByClassName('community-points-summary').arrive('button', clickPoints);
    } else {
        // Presumably outside of a channel page
        console.log('Detected outside of a channel page.');
    }
}

// Run main functions after 10 second delay to let other extensions load and potentially modify HTML
function main() {
    setInterval(function() {
        //console.log('Twitch Points Autoclicker: Initialized!');
        true_check = true;
        clickPoints();
        hideBonusPointsSection();
    }, 10000);
}

main();