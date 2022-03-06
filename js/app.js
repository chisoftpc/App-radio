/*
 *      Copyright (c) 2016 Samsung Electronics Co., Ltd
 *
 *      Licensed under the Flora License, Version 1.1 (the "License");
 *      you may not use this file except in compliance with the License.
 *      You may obtain a copy of the License at
 *
 *              http://floralicense.org/license/
 *
 *      Unless required by applicable law or agreed to in writing, software
 *      distributed under the License is distributed on an "AS IS" BASIS,
 *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *      See the License for the specific language governing permissions and
 *      limitations under the License.
 */

/*global tau, tauProgress, tauMoreOptions, tauList*/
/*exported app*/

var app =
(function() {
    /**
     * MAX_DURATION_SEC - Maximum amount of recording time in seconds (5 minutes)
     * gIsRecording - Checks if it is in recording/stand-by mode
     * gRecordingSec - Seconds of the recording time
     * gRecordingMin - Minutes of the recording time
     * gRecordingSecTotal - Total amount of recording time in seconds
     * gVoiceArray = [] - Array of voice recordings - stores information about voiceIndex, voiceTime, voiceDuration
     * gRecordingIndex - Index of the voice being recorded at current time
     * gPlayingIndex - Index of the voice being played at current time
     * gProgressInterval - Interval for changing the progress time and the progress bar
     * listEvents - Set of functions for handling list-related events
     * uiEvents - Set of functions for handling UI-related events
     */
    var MAX_DURATION_SEC = 300,
        gIsRecording = 0,
        gRecordingSec = 0,
        gRecordingMin = 0,
        gRecordingSecTotal = 0,
        gVoiceArray = [],
        gRecordingIndex,
        gPlayingIndex,
        gProgressInterval,
        listEvents,
        uiEvents,
        app = {};

    // Allow MAX_DURATION_SEC to be called outside of app.js
    app.MAX_DURATION_SEC = MAX_DURATION_SEC;

    /**
     * Shows all div's with a specific class name
     * @private
     * @param {String} elementClass - the class name of the elements to be shown
     */
    function showDiv(elementClass) {
        var element = document.getElementsByClassName(elementClass),
            i;

        for (i = 0; i < element.length; i++) {
            element[i].style.display = "block";
        }
    }

    /**
     * Hides all div's with a specific class name
     * @private
     * @param {String} elementClass - the class name of the elements to be hidden
     */
    function hideDiv(elementClass) {
        var element = document.getElementsByClassName(elementClass),
            i;

        for (i = 0; i < element.length; i++) {
            element[i].style.display = "none";
        }
    }

    /**
     * Changes the opacity of an element's background color
     * @private
     * @param {String} elemId - the id name of the element
     * @param {Number} opacity - the value of the new opacity
     */
    function changeBgOpacity(elemId, opacity) {
        var element = document.getElementById(elemId);

        element.style.opacity = opacity;
    }

    /**
     * Changes the progress time and the progress bar
     * @private
     */
    function changeProgress() {
        gRecordingSec++;
        gRecordingSecTotal++;

        // Add 1 minute per 60 seconds
        if (gRecordingSec === 60) {
            gRecordingSec = 0;
            gRecordingMin++;
        }

        // Change text for minutes
        // If a single digit value, add "0" in front of the value
        if (gRecordingMin < 10) {
            document.getElementById("durMinute").innerHTML = "0" + gRecordingMin;
        } else {
            document.getElementById("durMinute").innerHTML = gRecordingMin;
        }

        // Change text for seconds
        if (gRecordingSec < 10) {
            document.getElementById("durSecond").innerHTML = "0" + gRecordingSec;
        } else {
            document.getElementById("durSecond").innerHTML = gRecordingSec;
        }

        // Change the progress bar
        tauProgress.changeProgressValue();

        // Stop the recording automatically after the maximum amount of recording time has passed
        if (gRecordingSecTotal >= MAX_DURATION_SEC) {
            document.getElementById("voice-recorder-stop").click();
        }
    }

    /**
     * Starts recording
     * @private
     */
    function startRecording() {
        // Reset the recording time
        gRecordingSec = 0;
        gRecordingMin = 0;

        // Change text for recording title
        if (gRecordingIndex < 10) {
            document.getElementById("recording-title").innerHTML = "Voice 0" + gRecordingIndex;
        } else {
            document.getElementById("recording-title").innerHTML = "Voice " + gRecordingIndex;
        }

        // Set interval for changing the progress time and the progress bar (every 1 second)
        gProgressInterval = setInterval(changeProgress, 1000);
    }

    /**
     * Resets data about recording
     * @private
     */
    function resetRecording() {
        // Stop the interval for changing the progress time and the progress bar
        clearInterval(gProgressInterval);

        // Change texts to show stand-by mode
        document.getElementById("recording-title").innerHTML = "Voice Memo";
        document.getElementById("durMinute").innerHTML = "00";
        document.getElementById("durSecond").innerHTML = "00";
    }

    /**
     * Shows play page
     * @private
     * @param {Number} arrayIndex - the array index of the voice to be played
     */
    function showPlayPage(arrayIndex) {
        // Show the information about the voice to be played
        document.getElementById("play-title").innerHTML = "Voice " + gVoiceArray[arrayIndex].voiceIndex;
        document.getElementById("play-time").innerHTML = gVoiceArray[arrayIndex].voiceTime;
        document.getElementById("play-duration").innerHTML = gVoiceArray[arrayIndex].voiceDuration;

        tau.changePage("#play");

        gPlayingIndex = arrayIndex;
    }

    /**
     * Handles list-related events
     * @public
     */
    listEvents = (function() {
        var listEvents = {};

        /**
         * Shows the play page when a recording item is clicked
         * @public
         * @param {Object} event - the object for click event
         */
        function clickList(event) {
            var target = event.target;

            if (target.classList.contains("li-voice") || target.classList.contains("li-voice-a")) {
                showPlayPage(target.id);
            }
        }

        /**
         * Adds click event listener to each recording item
         * @public
         */
        function addListEvent() {
            var voiceList = document.getElementsByClassName("li-voice"),
                i;

            for (i = 0; i < voiceList.length; i++) {
                voiceList[i].addEventListener("click", clickList);
            }
        }

        /**
         * Creates a list of recordings with the data from gVoiceArray
         * @public
         */
        listEvents.createList = function() {
            var htmlStr = "",
                i;

            // If there is no item in gVoiceArray, show "No recordings" page
            if (gVoiceArray.length === 0) {
                hideDiv("ui-listview");
                showDiv("ui-listview-none");
            }
            // If there is more than one item in gVoiceArray, create a list of the item(s)
            else {
                hideDiv("ui-listview-none");
                showDiv("ui-listview");

                for (i = gVoiceArray.length - 1; i >= 0; i--) {
                    htmlStr += "<li id=" + i + " class='li-has-multiline li-has-2line-sub li-voice'>";
                    htmlStr += "<a  id=" + i + " class='li-voice-a'>" + "Voice " + gVoiceArray[i].voiceIndex;
                    htmlStr += "<span class='ui-li-sub-text li-text-sub'>" + gVoiceArray[i].voiceTime + "</span>";
                    htmlStr += "<span class='ui-li-sub-text li-text-sub'>" + gVoiceArray[i].voiceDuration + "</span>";
                    htmlStr += "</a>" + "</li>";
                }

                document.getElementById("list-recordings").innerHTML = htmlStr;
                addListEvent();
            }
        };

        /**
         * Adds a new recording to gVoiceArray
         * @public
         */
        listEvents.addVoice = function() {
            var date = new Date(),
                indexStr = "",
                timeStr = "",
                durationStr = "",
                newVoice;

            // Set the value of voiceIndex
            indexStr += (gRecordingIndex >= 10) ? gRecordingIndex : ("0" + gRecordingIndex);

            // Set the value of voiceTime
            if (date.getHours() < 12) {
                timeStr += (date.getHours() >= 10) ? date.getHours() : ("0" + date.getHours());
                timeStr += ":";
                timeStr += (date.getMinutes() >= 10) ? date.getMinutes() : ("0" + date.getMinutes());
                timeStr += "am";
            } else if (date.getHours() === 12) {
                timeStr += date.getHours();
                timeStr += ":";
                timeStr += (date.getMinutes() >= 10) ? date.getMinutes() : ("0" + date.getMinutes());
                timeStr += "pm";
            } else if (date.getHours() > 12) {
                timeStr += (date.getHours() % 12 >= 10) ? (date.getHours() % 12) : ("0" + date.getHours() % 12);
                timeStr += ":";
                timeStr += (date.getMinutes() >= 10) ? date.getMinutes() : ("0" + date.getMinutes());
                timeStr += "pm";
            }

            // Set the value of duration
            durationStr += (gRecordingMin >= 10) ? gRecordingMin : ("0" + gRecordingMin);
            durationStr += ":";
            durationStr += (gRecordingSec >= 10) ? gRecordingSec : ("0" + gRecordingSec);

            // Create a new object
            newVoice = {
                voiceIndex: indexStr,
                voiceTime: timeStr,
                voiceDuration: durationStr
            };

            // Add the object (newVoice) to the array (gVoiceArray)
            gVoiceArray.push(newVoice);

            gRecordingIndex++;

            // Recreate the list as the data has been changed
            listEvents.createList();
        };

        /**
         * Deletes a recording from gVoiceArray
         * @public
         */
        listEvents.deleteVoice = function() {
            gVoiceArray.splice(gPlayingIndex, 1);

            // Recreate the list as the data has been changed
            listEvents.createList();
        };

        return listEvents;
    }());

    // Allow listEvents.deleteVoice to be called outside of app.js
    app.deleteVoice = listEvents.deleteVoice;

    /**
     * Handles UI-related events
     * @public
     */
    uiEvents = (function() {
        var uiEvents = {};

        /**
         * Changes the view when recording starts
         * @public
         */
        uiEvents.startRecording = function() {
            hideDiv("stand-by");
            showDiv("recording");
            changeBgOpacity("voice-recorder-effect-bg", 0.5);
            hideDiv("ui-icon-overflow");
            tauProgress.pageBeforeShowHandler();
            gIsRecording = 1;
            startRecording();
        };

        /**
         * Changes the view when recording stops
         * @public
         */
        uiEvents.stopRecording = function() {
            listEvents.addVoice();
            if (gRecordingSecTotal > 0) {
                showPlayPage(gVoiceArray.length - 1);
            }
            hideDiv("recording");
            showDiv("stand-by");
            hideDiv("recording-resume");
            showDiv("recording-pause");
            showDiv("ui-icon-overflow");
            tauProgress.pageHideHandler();
            gIsRecording = 0;
            resetRecording();
        };

        /**
         * Changes the view when recording is paused
         * @public
         */
        uiEvents.pauseRecording = function() {
            hideDiv("recording-pause");
            hideDiv("ui-progressbar");
            showDiv("recording-resume");
            changeBgOpacity("voice-recorder-effect-bg", 0);
            clearInterval(gProgressInterval);
        };

        /**
         * Changes the view when recording is resumed
         * @public
         */
        uiEvents.resumeRecording = function() {
            hideDiv("recording-resume");
            showDiv("recording-pause");
            showDiv("ui-progressbar");
            changeBgOpacity("voice-recorder-effect-bg", 0.5);
            gProgressInterval = setInterval(changeProgress, 1000);
        };

        /**
         * Changes the view when recording is cancelled
         * @public
         */
        uiEvents.cancelRecording = function() {
            hideDiv("recording");
            showDiv("stand-by");
            hideDiv("recording-resume");
            showDiv("recording-pause");
            showDiv("ui-icon-overflow");
            tauProgress.pageHideHandler();
            gIsRecording = 0;
            resetRecording();
        };

        /**
         * Opens pop-up for BT connection
         * @public
         */
        uiEvents.btConnect = function() {
            var popupBtConnect = document.getElementById("bt-connection");

            tau.openPopup(popupBtConnect);
        };

        /**
         * Changes the view to the main page
         * @public
         */
        uiEvents.changePageMain = function() {
            tau.changePage("#main");
        };

        return uiEvents;
    }());

    /**
     * Handles events for hardware key
     * @public
     * @param {Object} event - the object for click event
     */
    function keyEventHandler(event) {
        if (event.keyName === "back") {
            var page = document.getElementsByClassName('ui-page-active')[0],
                popup = document.getElementsByClassName('ui-popup-active')[0],
                popupCancel = document.getElementById("recording-cancel"),
                pageid = "main";

            pageid = popup ? popup.id : (page ? page.id : "");

            if (pageid === "main") {
                // Check if the main page is in recording or stand-by mode
                // If in stand-by mode, just close the application
                if (gIsRecording === 0) {
                    try {
                        tizen.application.getCurrentApplication().exit();
                    } catch (ignore) {

                    }
                }
                // If in recording mode, show a pop-up asking if the user really wants to cancel the recording
                else {
                    tau.openPopup(popupCancel);
                }
            } else if (pageid === "list") {
                tau.changePage("#main");
            } else {
                window.history.back();
            }
        }
    }

    /**
     * Initiates the application
     * @public
     */
    function init() {
        // Set the value of gRecordingIndex
        if (gVoiceArray.length === 0) {
            gRecordingIndex = 1;
        } else {
            gRecordingIndex = parseInt(gVoiceArray[gVoiceArray.length - 1].voiceIndex, 10) + 1;
        }

        // Create a list with the data in gVoiceArray
        listEvents.createList();

        // Add event listeners for all buttons
        document.getElementById("voice-recorder-start").addEventListener("click", uiEvents.startRecording);
        document.getElementById("voice-recorder-stop").addEventListener("click", uiEvents.stopRecording);
        document.getElementById("voice-recorder-pause").addEventListener("click", uiEvents.pauseRecording);
        document.getElementById("voice-recorder-resume").addEventListener("click", uiEvents.resumeRecording);
        document.getElementById("voice-recorder-cancel").addEventListener("click", uiEvents.cancelRecording);
        document.getElementById("recording-cancel-ok").addEventListener("click", uiEvents.cancelRecording);
        document.getElementById("btn-play").addEventListener("click", uiEvents.btConnect);
        document.getElementById("bt-connection-ok").addEventListener("click", uiEvents.changePageMain);

        // Add event listeners for tauMoreOptions & tauList components.
        document.querySelector("#main").addEventListener("pagebeforeshow", function() {
            tauMoreOptions.pageBeforeShowHandler("#main");
        });
        document.querySelector("#main").addEventListener("pagebeforehide", tauMoreOptions.pageHideHandler);
        document.querySelector("#play").addEventListener("pagebeforeshow", function() {
            tauMoreOptions.pageBeforeShowHandler("#play");
        });
        document.querySelector("#play").addEventListener("pagebeforehide", tauMoreOptions.pageHideHandler);
        document.querySelector("#list").addEventListener("pagebeforeshow", function() {
            tauList.pageBeforeShowHandler("#list");
        });
        document.querySelector("#list").addEventListener("pagebeforehide", tauList.pageHideHandler);

        // Add event listeners for Tizen hardware key
        window.addEventListener('tizenhwkey', keyEventHandler);
    }

    // Call the initiation function when the application is loaded
    window.onload = init();

    return app;
}());
