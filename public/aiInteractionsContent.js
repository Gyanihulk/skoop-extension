const targetNode = document.body;
const config = { childList: true, subtree: true };

const buttonsList = {
    "mainPrompt": "I am an Artificial Intelligence tool helping the LinkedIn users to make comments on various LinkedIn posts and their replies. Now generate replies according to the given instructions.",
    "buttonsData": [
        {
            "id": 1,
            "title": "Discovery",
            "prompt": "The above is a post on LinkedIn. I want to be an authoritative and insightful LinkedIn user who is friendly in response to the post. Write and add brand new insights in response to the post and make sure not to repeat what has already been said in the post. Use new words, phrases, ideas, and insights. Keep it short and professional. For every response use new starting sentence, new words, and phrases. Give precise response. Please give a response in the language of the above LinkedIn post.",
            "length": "four lines to eight lines",
            "tone": "friendly, concise"
        },
        {
            "id": 2,
            "title": "Inspiration",
            "prompt": "The above is a post on LinkedIn. Reply to this LinkedIn post with a comment that offers a positive and encouraging idea while showing empathy towards the original message. Your response should introduce a fresh, uplifting perspective, showing understanding and support for the challenges mentioned. Keep the tone optimistic, respectful, and solution-oriented, focusing on creativity and originality, without repeating what's already been discussed. Please don't repeat the previous response sentences. Everytime the response sentences should not be similar to the previous response sentences. Please give a response in the language of the above LinkedIn post.",
            "length": "four lines to eight lines",
            "tone": "optimistic, innovative, and uplifting"
        },
        {
            "id": 3,
            "title": "Thoughtful",
            "prompt": "The above is a post on LinkedIn. Reply with a concise, thoughtful observation that sparks engagement or deeper reflection. Keep the comment brief and impactful, adding a fresh angle to the conversation. Stay informative and focused, aiming for a short but meaningful contribution. Please don't repeat the previous responses. Everytime the response should not be similar to the previous response. Please give a response in the language of the above LinkedIn post.",
            "length": "three lines to eight lines",
            "tone": "concise, reflective"
        },
        {
            "id": 4,
            "title": "Cheerful",
            "prompt": "Be a cheerful and light-hearted LinkedIn user. Reply to this LinkedIn post with a comment that contains a touch of humor or amusement, while still being respectful and relevant. For every time I request you to write a comment using a funny tone, you must augment a brand-new comment with a new angle. Do not repeat what you previously generated. Make the funny comment with around 50 words. Include appropriate hashtags and emojis. Please don't repeat the previous responses. Everytime the response should not be similar to the previous response. Please give a response in the language of the above LinkedIn post.",
            "length": "fifty words to six lines",
            "tone": "cheerful, witty, and playful"
        }
    ]
}



const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList.contains('feed-shared-update-v2')) {
                    processCommentBoxes();
                    processReplyCommentBoxes();
                }
            });
        }
    }
};

const postNode = new MutationObserver(callback);
postNode.observe(targetNode, config);

function processCommentBoxes() {
    let comments = document.getElementsByClassName('comment-button');
    const addButtons = (commentBox) => {
        processReplyCommentBoxes();
        const buttonSection = commentBox.parentElement.querySelector('.skoop-comment-section');

        if (!buttonSection) {
            addSectionWithButton(commentBox);
        }
    }
    Array.from(comments).forEach((commentButton) => {
        let parent = commentButton.closest('.feed-shared-update-v2');

        let commentBox = parent ? parent.querySelector('.feed-shared-update-v2__comments-container').querySelector('.comments-comment-box__form') : '';
        if (commentBox) {
            addButtons(commentBox);
        } else {
            console.error('comments-comment-box not found');
        }

        if (!commentButton.hasAttribute('data-has-event-listener')) {
            commentButton.addEventListener('click', async (event) => {
                let parent = event.target.closest('.feed-shared-update-v2');

                let commentBox = parent ? parent.querySelector('.feed-shared-update-v2__comments-container').querySelector('.comments-comment-box__form') : '';
                if (commentBox) {
                    addButtons(commentBox);
                } else {
                    console.log('comments-comment-box not found');
                }
            });
            commentButton.setAttribute('data-has-event-listener', 'true');
        }
    });
}
processCommentBoxes();

async function createQueryForPostDescription(parent) {
    let descriptionContainer = parent.querySelector('.feed-shared-update-v2__description-wrapper');
    let pollContainer = parent.querySelector('.update-components-poll');
    let query = '';
    let entityContainer = parent.querySelector('.update-components-entity');
    let eventContainer = parent.querySelector('.update-components-event');
    let celebrationContainer = parent.querySelector('.update-components-celebration');
    let articleContainer = parent.querySelector('.update-components-article');
    let repostContainer = parent.querySelector('.feed-shared-update-v2__update-content-wrapper');
    let announcementContainer = parent.querySelector('.update-components-announcement');


    if (repostContainer) {
        let repostDescription = repostContainer.querySelector('.feed-shared-update-v2__description') ? repostContainer.querySelector('.feed-shared-update-v2__description').textContent.trim() : 'original post has no description';

        if (descriptionContainer) {
            const content = descriptionContainer.textContent.trim();

            query = `Use the repost description as context to craft a reply to the current post. Here's the repost description: \n ${repostDescription} \n and here's the current post description: \n ${content}.\
                    Please create a response that connects both. Please generate reply for this in the same language`;
        } else {

            query = `${repostDescription}.\n Please generate reply for this in the same language.`;
        }
    }

    // For main description
    if (descriptionContainer && !repostContainer) {
        const content = descriptionContainer.textContent.trim();
        query = `${content}.\n Please generate reply for this in the same language.`;
    }

    // For polls
    if (pollContainer) {
        const pollHeader = pollContainer.querySelector('.update-components-poll__header').textContent.trim();
        const pollOptions = [...pollContainer.querySelectorAll('.update-components-poll-option__text--justify-center')].map(option => option.textContent.trim());

        query = query + `\n\n This post contains a poll, the poll header is ${pollHeader}\n and poll options are ${pollOptions}.\n
                So while generating the comment consider this post header and options.\n Please generate reply for this in the same language`;
    }

    // For entities like find an expert
    if (entityContainer) {
        const articleTitle = entityContainer.querySelector('.update-components-entity__title span').textContent;
        const articleSubtitle = entityContainer.querySelector('.update-components-entity__subtitle') ? entityContainer.querySelector('.update-components-entity__subtitle').textContent : "this article has no subtitle so use title";
        const articleDescription = entityContainer.querySelector('.update-components-entity__description') ? entityContainer.querySelector('.update-components-entity__description').textContent : "this article has no description so use title and subtitle";

        query = query + `\n\n This post includes an article titled "${articleTitle}" from ${articleSubtitle}. The description says: "${articleDescription}".\n
                So while generating the comment consider this article. \n Please generate reply for this in the same language`;
    }

    //For events
    if (eventContainer) {
        const eventTitle = eventContainer.querySelector('.update-components-event__meta h2').textContent;
        const eventContext = eventContainer.querySelector('.feed-shared-event__title-context') ? eventContainer.querySelector('.feed-shared-event__title-context').textContent : "hasn't mentioned the context";
        const eventDescription = eventContainer.querySelector('.feed-shared-event__description') ? eventContainer.querySelector('.feed-shared-event__description').textContent : 'this event has no description so use title';
        const eventAttendees = eventContainer.querySelector('.v-align-middle') ? eventContainer.querySelector('.v-align-middle').textContent : 'has no attendees';
        const eventLink = eventContainer.querySelector('.update-components-event__banner-link').href;

        query = query + `\n\n This post includes an event titled "${eventTitle}", event context "${eventContext}". The event is described as "${eventDescription}" and currently has ${eventAttendees}. You can view the event here: ${eventLink}.\
                So while generating the comment consider this event. \n Please generate reply for this in the same language`;
    }

    // For celebrations
    if (celebrationContainer) {
        let celebrationHeadline = celebrationContainer.querySelector('.update-components-celebration__headline').textContent;
        let celebrationImage = celebrationContainer.querySelector('img').src;

        query = query + `\n\n This post includes a celebration with the headline "${celebrationHeadline}". Here's the image link: ${celebrationImage}.\
                So while generating the comment consider this celebration.\n Please generate reply for this in the same language`;
    }

    // For articles
    if (articleContainer) {
        let articleTitle = articleContainer.querySelector('.update-components-article__title span').innerText;
        let articleSubtitle = articleContainer.querySelector('.update-components-article__subtitle-ellipsis') ? articleContainer.querySelector('.update-components-article__subtitle-ellipsis').innerText : 'has no subtitle use title';
        let articleDescription = articleContainer.querySelector('.update-components-article__description') ? articleContainer.querySelector('.update-components-article__description').innerText : 'it has no description so use title and subtitle';
        let articleUrl = articleContainer.querySelector('a.update-components-article__meta') ? articleContainer.querySelector('a.update-components-article__meta').href : 'has no url';

        query = query + `\n\nThe post includes an article with the following details:\n
                Title: ${articleTitle}.\
                Subtitle: ${articleSubtitle}.\
                Description: ${articleDescription}.\
                Article URL: ${articleUrl}.\n
                So while generating the comment consider this article. \n Please generate reply for this in the same language`;
    }

    // For announcements
    if (announcementContainer) {
        let announcementTitle = announcementContainer.querySelector('.update-components-announcement__title') ? announcementContainer.querySelector('.update-components-announcement__title').textContent : 'this announcement has no title';

        query = query + `\n\nThe post include an announcement with the following details:\n
        Title: ${announcementTitle}\n
        So while generating the comment consider this announcement. \n Please generate reply for this in the same language`;
    }


    return { query };
}

async function makeAIInteractionsCall(button, query, commentBox, anchorTags = []) {

    // Display initial loading message
    await addLoadingMessageToCommentBox(commentBox, "Reading the post...");

    // Create an AbortController
    const controller = new AbortController();
    const { signal } = controller;

    // Set up a timeout to update the loading message after 7000ms -- 7 seconds
    const timeout5s = setTimeout(() => {
        addLoadingMessageToCommentBox(commentBox, "Taking more time than expected, please wait...");
    }, 7000);

    // Set up a timeout to stop the request after 13000ms -- 16 seconds
    const timeout13s = setTimeout(() => {
        controller.abort();  // Abort the aiInteractions request
        addLoadingMessageToCommentBox(commentBox, "Something has happened, please try again. If it presists, please refresh the page.");

    }, 16000);

    try {

        const response = await aiInteractions(button.title, query, signal);

        if (response) {
            // Clear all timeouts if the response arrives before 13 seconds
            clearTimeout(timeout5s);
            clearTimeout(timeout13s);
        }

        // Add the generated response to the comment box
        await addGeneratedTextToCommentBox(response, commentBox, anchorTags);
    } catch (error) {
        console.log("Error generating comment:", error);
        clearTimeout(timeout5s);
        clearTimeout(timeout13s);
        await addGeneratedTextToCommentBox("Something has happened, please try again. If it presists, please refresh the page.", commentBox);
    }
}

function getPreviousCommentsOfTheUser(parent, replieeNames) {
    // Select the replies list container
    const commentsRepliesList = parent.querySelector('.comments-replies-list') || parent.querySelector('.comments-comment-item__replies-list');

    if (!commentsRepliesList) {
        return [];
    }

    // Helper function to get comments from different class structures
    const getComments = (selector, replieeSelector) => {
        return [...commentsRepliesList.querySelectorAll(selector)]
            .filter(option => {
                const replieeElement = option.querySelector(replieeSelector);
                return replieeElement && replieeNames.includes(replieeElement.textContent.trim());
            })
            .map(option => option.querySelector('.comments-comment-item__main-content').textContent.trim());
    };

    // Try first class names, then fallback if no comments are found
    const previousComments = getComments('.comments-comment-entity', '.comments-comment-meta__description-title');

    // If no comments are found, try the alternate class names
    if (previousComments.length === 0) {
        return getComments('.comments-comment-item', '.comments-post-meta__name-text');
    }

    return previousComments;
}

function getMentionedUsers(commentBox) {
    const anchorTags = commentBox.querySelectorAll('.ql-mention');
    return Array.from(anchorTags);
}

function addSectionWithButton(commentBox, forReply = false) {

    try {
        // First, remove any existing section in the commentBox
        const existingSection = commentBox.parentElement.querySelector('.skoop-comment-section');
        if (existingSection) {
            existingSection.remove();
        }

        const newSection = document.createElement('div');
        newSection.className = 'skoop-comment-section';
        newSection.style.margin = '10px 0px';

        newSection.style.display = 'flex';
        newSection.style.flexWrap = 'wrap';
        newSection.style.gap = '3px';

        newSection.style.position = 'relative';

        // Create the tooltip
        const tooltip = document.createElement('div');
        tooltip.textContent = "Comment cannot be generated without a description.";
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = '#41b1d6';
        tooltip.style.color = '#ffffff';
        tooltip.style.padding = '5px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.fontSize = '12px';
        tooltip.style.display = 'none';
        tooltip.style.bottom = '35px';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-60%)';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.zIndex = '1000';

        newSection.appendChild(tooltip);

        // Show tooltip on hover
        newSection.addEventListener('mouseover', async (event) => {
            const postContainer = event.target.closest('.feed-shared-update-v2');
            let { query } = await createQueryForPostDescription(postContainer);
            if (!query) {
                tooltip.style.display = 'block';
            }
        })

        // Hide tooltip when not hovering
        newSection.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        })

        buttonsList.buttonsData.forEach((button) => {
            if (forReply) {
                const newButton = addButtonWithTypeToReply(button, commentBox);
                newSection.appendChild(newButton);
            } else {
                const newButton = addButtonWithType(button, commentBox);
                newSection.appendChild(newButton);
            }
        });


        const moreOptionsButton = document.createElement('button');

        moreOptionsButton.textContent = '⋮'; // Three dots
        moreOptionsButton.style.cursor = 'pointer';
        moreOptionsButton.style.background = 'none';
        moreOptionsButton.style.border = 'none';
        moreOptionsButton.style.fontSize = '24px'; // Increase the font size for larger dots
        moreOptionsButton.style.padding = '5px'; // Add some padding for better click area
        moreOptionsButton.style.margin = '-8px 0 0 3px';
        newSection.appendChild(moreOptionsButton);
        const moreOptionsContainer = document.createElement('div');
        moreOptionsContainer.style.position = 'relative';
        moreOptionsContainer.appendChild(moreOptionsButton);

        // Create dialog
        const dialog = document.createElement('div');
        dialog.id = "skoop-dialog"
        dialog.style.display = 'none'; // Initially hidden
        dialog.style.position = 'absolute';
        dialog.style.top = '30px';
        dialog.style.right = '0';
        dialog.style.background = '#fff';
        dialog.style.border = '1px solid #ccc';
        dialog.style.borderRadius = '5px';
        dialog.style.padding = '10px';
        dialog.style.zIndex = '2000';
        dialog.style.width = '130px';

        // Create "Get Pro" button
        // Create "Get Pro" button
        const getProButton = document.createElement('button');
        getProButton.textContent = 'Get Pro';
        getProButton.style.fontSize = '14px'; // Adjust font size
        getProButton.style.fontWeight = 'bold'; // Make the text bold
        getProButton.style.color = '#ffffff'; // White text color
        getProButton.style.backgroundColor = 'rgb(45, 104, 196)';
        getProButton.style.border = 'none'; // Remove border
        getProButton.style.borderRadius = '5px'; // Rounded corners
        getProButton.style.padding = '5px 10px'; // Add some padding
        getProButton.style.cursor = 'pointer'; // Pointer cursor for interaction
        getProButton.style.marginTop = '10px'; // Space between Get Pro and the separator
        getProButton.style.display = 'block';
        getProButton.style.width = '100%'; // Full-width button
        getProButton.addEventListener('click', () => {
            const container = document.getElementById('skoop-extension-container')
            container.style.display = 'block'
            chrome.runtime.sendMessage({
                action: 'navigateToSubscriptionScreen',
            },
                (response) => {
                    if (chrome.runtime.lastError) {
                        console.log(chrome.runtime.lastError);
                    } else {
                        //    console.log(response)
                    }
                });
            dialog.style.display = 'none';

        });

        // Create the remaining queries button
        let userSettings

        const remainingValueButton = document.createElement('button');

        remainingValueButton.style.fontSize = '12px'; // Adjust the font size
        remainingValueButton.style.color = '#000'; // Black text color
        remainingValueButton.style.background = 'none'; // Remove button background
        remainingValueButton.style.border = 'none'; // Remove button border
        remainingValueButton.style.display = 'flex'; // Flex to align icon and text
        remainingValueButton.style.alignItems = 'center'; // Vertically center text and icon
        remainingValueButton.style.cursor = 'pointer'; // Pointer cursor for interaction

        // Add lightning emoji before the text


        // Create a separator
        const separator = document.createElement('div');
        separator.style.height = '1px'; // Height of the separator
        separator.style.backgroundColor = '#e0e0e0'; // Light gray color for the separator
        separator.style.margin = '10px 0'; // Space around the separator

        // Append elements to the dialog
        dialog.appendChild(remainingValueButton);
        dialog.appendChild(separator); // Append separator between the buttons
        dialog.appendChild(getProButton);
        moreOptionsContainer.appendChild(dialog);
        // Append the dialog to the section
        newSection.appendChild(moreOptionsContainer);

        // Toggle dialog on button click
        moreOptionsButton.addEventListener('click', async () => {
            try {
                userSettings = await getUserSettings()
                console.log(userSettings, "from getting usersetting")
                if (userSettings?.fullAccess) { moreOptionsButton.style.display = 'none'; dialog.style.display = 'none'; } else{
                    if(userSettings?.status!==401){
                        remainingValueButton.style.display='flex'
                        remainingValueButton.textContent = userSettings?.remainingComments + ' Queries Left';
                        const icon = document.createElement('span');
                        icon.textContent = '✨';
                        icon.style.marginRight = '8px';
                        icon.style.fontSize = '12px';
                    
                        remainingValueButton.prepend(icon);
                    }else{
                        remainingValueButton.style.display='none'
                    }
                    

                    dialog.style.display = dialog.style.display === 'none' ? 'block' : 'none'; // Toggle visibility
                };


            } catch (error) {
                console.error(error)
            }


        });
        getUserSettings().then((response) => { if (response.fullAccess) (moreOptionsButton.style.display = 'none'); })
        // Close the dialog when clicking outside
        document.addEventListener('click', (event) => {
            if (!newSection.contains(event.target)) {
                dialog.style.display = 'none';
            }
        });

        commentBox.appendChild(newSection);
    } catch (err) { console.error(err) }

}

function createButton(button) {
    const newButton = document.createElement('button');
    newButton.className = 'rounded-button';
    newButton.textContent = button.title;
    newButton.style.borderRadius = '15px';
    newButton.style.height = '30px';
    newButton.style.width = '80';
    newButton.style.padding = '0 7px';
    newButton.style.border = '1px solid';
    newButton.style.backgroundColor = '#2d68c4';
    newButton.style.cursor = 'pointer';
    newButton.style.outline = 'none';
    newButton.style.color = 'white';
    newButton.style.fontSize = '12px';
    newButton.style.whiteSpace = 'nowrap';

    return newButton;
}

function addButtonWithType(button, commentBox) {
    const newButton = createButton(button);

    newButton.addEventListener('click', async (event) => {
        event.preventDefault();
        let dialog = document.getElementById("skoop-dialog")
        if (dialog) {
            dialog.style.display = 'none';
        }
        // Ensure we use the correct comment box for this button
        let parent = newButton.closest('.feed-shared-update-v2');
        let commentBox = parent.querySelector('.comments-comment-box-comment__text-editor');

        if (commentBox) {
            let { query } = await createQueryForPostDescription(parent);
            if (query) {
                const queryForPost = `${buttonsList?.mainPrompt}\n` + query + `\n\n${button.prompt}\nKeep it under ${button.length}. And use ${button.tone} tone.`;
                await makeAIInteractionsCall(button, queryForPost, commentBox);
            } else {
                console.log('unable to form a query ');
            }

        } else {
            console.log('comment box not found to add generated text');
        }
    });
    return newButton;
}

function addButtonWithTypeToReply(button, commnetBox) {
    const newButton = createButton(button);

    newButton.addEventListener('click', async (event) => {
        // Ensure we use the correct comment box for this button
        event.preventDefault();
        let parent = event.target.closest('.comments-comment-entity') ? event.target.closest('.comments-comment-entity') : event.target.closest('.comments-comment-item');
        let postContainer = event.target.closest('.feed-shared-update-v2');

        let commentContainer = parent ? parent.querySelector('.update-components-text') : '';

        let replyCommentBox = parent ? parent.querySelector('.comments-comment-box-comment__text-editor') : '';


        let postQuery = ''
        if (postContainer) {
            const { query } = await createQueryForPostDescription(postContainer);
            postQuery = query;
        }
        if (replyCommentBox) {
            let query = '';
            // Extract all the anchor tags (mentioned users)
            const anchorTags = getMentionedUsers(replyCommentBox);
            const replieeNames = replyCommentBox.textContent.trim();
            const replieeNamesFromAnchorTags = [...replyCommentBox.querySelectorAll('.ql-mention')].map(mention => mention.textContent);
            const previousCommentsOfTheUser = getPreviousCommentsOfTheUser(parent, replieeNames);
            if (commentContainer) {
                const commentDescription = commentContainer.textContent.trim();
                // let commentLanguage = await getPostLanguage(commentDescription);
                query = `This is the post description:\n ${postQuery}\n
                This is the main comment on the post:\n ${commentDescription}\n
                Here are the mentioned names to whom you need to reply: ${replieeNamesFromAnchorTags}. Please consider comments from these mentioned names while generating your reply.\n
                These are the thread comments from the users you are replying to: \n${previousCommentsOfTheUser}\n (ignore any names that are not part of the mentioned names in these thread comments).\n
                If thread comments are available, prioritize replying to them. If no thread comments are present, reply to the main comment instead.\n
                Ensure the generated reply aligns with the context and is relatable to the thread comments (if available) or the main comment. The reply length should not exceed the length of the comment by more than 2 lines (e.g., if a comment is 1 line, your reply should be no more than 3 lines).\
                Additionally, only reply to the mentioned names provided, excluding any others.\n
                Generate the reply in the same language as the thread comments. If thread comments are unavailable, use the language of the main comment.\
                Now generate an appropriate reply based on this context.`;

                const queryForReply = `${buttonsList?.mainPrompt}\n` + query + `\n\n${button.prompt}\n. And use ${button.tone} tone.`;

                await makeAIInteractionsCall(button, queryForReply, replyCommentBox, anchorTags);
            }
        }
    });
    return newButton;
}

// Helper function to simulate a delay (e.g., 5 seconds)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// aiInteractions function modified to accept the AbortSignal and handle abortion
async function aiInteractions(type, query, signal) {

    // Simulate a 15-second delay before making the request for testing
    // await delay(15000);

    return new Promise((resolve, reject) => {
        // Send message to background script, passing the signal to abort the request
        chrome.runtime.sendMessage({
            action: 'generateCommentCGPT',
            type: type,
            query: query,
        },
            (response) => {

                if (signal.aborted) {
                    reject(new DOMException('Request aborted', 'AbortError'));
                } else if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError);
                    reject(new Error('Failed to generate comment. Please try again'));
                } else {
                    if (response) {
                        resolve(response);
                    } else {
                        reject(new Error('Encountered some issue. Please try again.'));
                    }
                }
            });
    });
}

async function getUserSettings() {
    return new Promise((resolve, reject) => {
        // Send message to background script, passing the signal to abort the request
        chrome.runtime.sendMessage({
            action: 'getUserSettings',
        },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError);
                    reject(new Error('Failed to get user settings. Please try again'));
                } else {
                    if (response) {

                        resolve(response);
                    } else {

                        reject(new Error('Encountered some issue. Please try again.'));
                    }
                }
            });
    });
}



async function addGeneratedTextToCommentBox(response, commentBox, anchorTags = []) {
    await addTextToCommentBox(response, commentBox, anchorTags);
    return;
}

async function addLoadingMessageToCommentBox(commentBox, message) {
    await addTextToCommentBox(message, commentBox);
    return;

}


// Function to type text into the comment box
async function addTextToCommentBox(response, commentBox, anchorTags = []) {
    if (commentBox) {
        let editor = commentBox.querySelector('.ql-editor');
        if (editor) {
            let index = 0;
            // Clear the editor content
            editor.innerHTML = '';

            const p = document.createElement('p');
            p.className = 'append-text';
            editor.appendChild(p);
            let appendText = editor.querySelector('.append-text');

            // Typing simulation
            const typeEffect = () => {
                if (index < response.length) {
                    appendText.textContent += response.charAt(index);// Append each character to the editor's textContent
                    index++;
                    setTimeout(typeEffect, 20); // Adjust typing speed here
                }
            };

            return new Promise(resolve => {
                const finishTyping = () => {
                    if (index >= response.length) {
                        resolve();
                        if (anchorTags.length >= 1) {
                            anchorTags.forEach(anchor => {
                                editor.appendChild(anchor.cloneNode(true));
                            });
                        }
                        // to append the text from "post comment" functionality
                        if (!editor.hasAttribute('is-comment-generated')) {
                            editor.setAttribute('is-comment-generated', 'true');
                        }
                    } else {
                        setTimeout(finishTyping, 20);
                    }
                };

                typeEffect();
                finishTyping();
            });

        } else {
            console.log('Editor not found inside the comment box');
        }
    } else {
        console.log('Comment box not found');
    }
}



function resetAndAddButtonsToAllReplyBoxes(parent) {
    // Get all reply comment boxes in the document
    const replyBoxes = parent.querySelectorAll('.comments-comment-box__form');

    // Loop through each reply box and add buttons
    replyBoxes.forEach((replyBox) => {
        addSectionWithButton(replyBox, true); // true means for reply
    });
}


// Process reply buttons dynamically
function processReplyCommentBoxes() {
    document.body.addEventListener('click', function (event) {
        // Check if the clicked element is a reply button
        const replyButton = event.target.closest('.reply');

        if (replyButton) {
            const commentContainer = replyButton.closest('.comments-comments-list');


            const replyBox = commentContainer ? commentContainer.querySelector('.comments-comment-box__form') : '';


            if (replyBox) {
                // Call function to reset and re-add buttons for all reply boxes
                resetAndAddButtonsToAllReplyBoxes(commentContainer);

            } else {
                console.log('Reply box not found');
            }
        } else {
            console.log('Reply button not found ');
        }
    });

}