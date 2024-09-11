const buttonsList = [
    {
        id: 1,
        title: "New Insight",
        prompt: "The above is a post on LinkedIn. I want to be an authoritative and insightful LinkedIn user who is friendly in response to the post.\
        Write and add brand new insights in response to the post and make sure not to repeat what has already been said in the post.\
        Use new words, phrases, ideas and insights. Keep it short and professional.",
        length: "four lines",
        tone: "friendly"
    },
    {
        id: 2,
        title: "Bright Notion",
        prompt: "The above is a post on LinkedIn. Reply to this LinkedIn post with a comment that offers a positive and encouraging idea while showing empathy towards the original message.\
        Your response should introduce a fresh, uplifting perspective, showing understanding and support for the challenges mentioned.\
        Keep the tone optimistic, respectful, and solution-oriented, focusing on creativity and originality, without repeating what's already been discussed.",
        length: "four lines",
        tone: "optimistic, innovative, and uplifting"
    },
    {
        id: 3,
        title: "Quick Thought",
        prompt: "The above is a post on LinkedIn. Reply with a concise, thoughtful observation that sparks engagement or deeper reflection.\
        Keep the comment brief and impactful, adding a fresh angle to the conversation. Stay informative and focused, aiming for a short but meaningful contribution",
        length: "three lines",
        tone: "concise, reflective"
    },
    {
        id: 4,
        title: "Lighthearted",
        prompt: "Be a cheerful and light-hearted LinkedIn user.\
        Reply to this LinkedIn post with a comment that contains a touch of humor or amusement, while still being respectful and relevant.\
        For every time I request you to write a comment using a funny tone, you must augment a brand-new comment with a new angle. \
        Do not repeat what you previously generated. Make the funny comment with around 50 words.\
        Include appropriate hashtags and emoji.",
        length: "fifty words",
        tone: "cheerful, witty, and playful"
    }
];

const targetNode = document.body;
const config = { childList: true, subtree: true };

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
    Array.from(comments).forEach((commentButton) => {
        if (!commentButton.hasAttribute('data-has-event-listener')) {
            commentButton.addEventListener('click', async () => {
                processReplyCommentBoxes();
                let parent = commentButton.parentElement.parentElement.parentElement.parentElement
                let commentBox = parent.querySelector('.feed-shared-update-v2__comments-container').querySelector('.comments-comment-texteditor')
                if (commentBox) {
                    const buttonSection = commentBox.parentElement.querySelector('.skoop-comment-section');
                    if (!buttonSection) {
                        addSectionWithButton(commentBox);
                    }
                    console.log('added section to the button');
                } else {
                    console.error('comments-comment-box not found');
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
    let postLanguage = 'English';
    console.log('repost container ', repostContainer);
    //let imageContainer = parent.querySelector('.update-components-image');

    if (repostContainer) {
        let repostDescription = repostContainer.querySelector('.feed-shared-update-v2__description') ? repostContainer.querySelector('.feed-shared-update-v2__description').textContent : 'original post has no description';

        if (descriptionContainer) {
            const content = descriptionContainer.textContent;
            postLanguage = await getPostLanguage(content);
            query = `Use the repost description as context to craft a reply to the current post. Here's the repost description: \n ${repostDescription} \n and here's the current post description: \n ${content}.\
                    Please create a response that connects both.`;
        } else {
            postLanguage = await getPostLanguage(repostDescription);
            query = `${repostDescription}`;
        }
    }

    // For main description
    if (descriptionContainer && !repostContainer) {
        const content = descriptionContainer.textContent;
        postLanguage = await getPostLanguage(content);
        query = `${content}`;
    }

    // For polls
    if (pollContainer) {
        const pollHeader = pollContainer.querySelector('.update-components-poll__header').textContent;
        const pollOptions = [...pollContainer.querySelectorAll('.update-components-poll-option__text--justify-center')].map(option => option.textContent.trim());

        query = query + `\n\n This post contains a poll, the poll header is ${pollHeader} and poll options is ${pollOptions}.\
                So while generating the comment consider this post header and options`;
    }

    // For entities like find an expert
    if (entityContainer) {
        const articleTitle = entityContainer.querySelector('.update-components-entity__title span').textContent;
        const articleSubtitle = entityContainer.querySelector('.update-components-entity__subtitle') ? entityContainer.querySelector('.update-components-entity__subtitle').textContent : "this article has no subtitle so use title";
        const articleDescription = entityContainer.querySelector('.update-components-entity__description') ? entityContainer.querySelector('.update-components-entity__description').textContent : "this article has no description so use title and subtitle";

        query = query + `\n\n This post includes an article titled "${articleTitle}" from ${articleSubtitle}. The description says: "${articleDescription}".\
                So while generating the comment consider this article`;
    }

    //For events
    if (eventContainer) {
        const eventTitle = eventContainer.querySelector('.update-components-event__meta h2').textContent;
        const eventContext = eventContainer.querySelector('.feed-shared-event__title-context') ? eventContainer.querySelector('.feed-shared-event__title-context').textContent : "hasn't mentioned the context";
        const eventDescription = eventContainer.querySelector('.feed-shared-event__description') ? eventContainer.querySelector('.feed-shared-event__description').textContent : 'this event has no description so use title';
        const eventAttendees = eventContainer.querySelector('.v-align-middle') ? eventContainer.querySelector('.v-align-middle').textContent : 'has no attendees';
        const eventLink = eventContainer.querySelector('.update-components-event__banner-link').href;

        query = query + `\n\n This post includes an event titled "${eventTitle}", event context "${eventContext}". The event is described as "${eventDescription}" and currently has ${eventAttendees}. You can view the event here: ${eventLink}.\
                So while generating the comment consider this event`;
    }

    // For celebrations
    if (celebrationContainer) {
        let celebrationHeadline = celebrationContainer.querySelector('.update-components-celebration__headline').textContent;
        let celebrationImage = celebrationContainer.querySelector('img').src;

        query = query + `\n\n This post includes a celebration with the headline "${celebrationHeadline}". Here's the image link: ${celebrationImage}.\
                So while generating the comment consider this celebration`;
    }

    // For articles
    if (articleContainer) {
        let articleTitle = articleContainer.querySelector('.update-components-article__title span').innerText;
        let articleSubtitle = articleContainer.querySelector('.update-components-article__subtitle-ellipsis') ? articleContainer.querySelector('.update-components-article__subtitle-ellipsis').innerText : 'has no subtitle use title';
        let articleDescription = articleContainer.querySelector('.update-components-article__description') ? articleContainer.querySelector('.update-components-article__description').innerText : 'it has no description so use title and subtitle';
        let articleUrl = articleContainer.querySelector('a.update-components-article__meta') ? articleContainer.querySelector('a.update-components-article__meta').href : 'has no url';

        query = query + `\n\nThe post includes an article with the following details:\
                Title: ${articleTitle}.\
                Subtitle: ${articleSubtitle}.\
                Description: ${articleDescription}.\
                Article URL: ${articleUrl}.\
                So while generating the comment consider this article`;
    }
    
    // For announcements
    if(announcementContainer) {
        let announcementTitle = announcementContainer.querySelector('.update-components-announcement__title') ? announcementContainer.querySelector('.update-components-announcement__title').textContent : 'this announcement has no title';
        
        query = query + `\n\nThe post include an announcement with the following details:\
        Title: ${announcementTitle}\
        So while generating the comment consider this announcement`;
    }


    return {query, postLanguage};
}

async function makeChatGptCall(button, query, commentBox, language, anchorTags = []) {
    language = new Intl.DisplayNames(['en'], { type: 'language' }).of(language); // getFullLanguageName(postLanguage);
    query = query + `\n\n${button.prompt}\nKeep it under ${button.length}. And use ${button.tone} tone.\n You should reply in ${language} language. Please follow language requirement strictly. The comment should be in ${language} language.`;
    // Display initial loading message
    await addLoadingMessageToCommentBox(commentBox, "Reading the post...");

    // Create an AbortController
    const controller = new AbortController();
    const { signal } = controller;

    // Set up a timeout to update the loading message after 5000ms -- 7 seconds
    const timeout5s = setTimeout(() => {
        addLoadingMessageToCommentBox(commentBox, "Taking more time than expected, please wait...");
    }, 7000);

    // Set up a timeout to stop the request after 13000ms -- 16 seconds
    const timeout13s = setTimeout(() => {
        controller.abort();  // Abort the ChatGPT request
        addLoadingMessageToCommentBox(commentBox, "Something has happened, please try again. If it presists, please refresh the page.");
        console.error('ChatGPT request stopped due to timeout.');
    }, 16000);

    try {
        const processStartTime = Date.now();

        const response = await chatGpt(button.title, query, signal);
        let message = '';

        if (response) {
            //message = response;
            const processEndTime = Date.now();
            console.log('Time taken to get the response from the backend:', processEndTime - processStartTime);

            // Clear all timeouts if the response arrives before 13 seconds
            clearTimeout(timeout5s);
            clearTimeout(timeout13s);
        }

        // Add the generated response to the comment box
        await addGeneratedTextToCommentBox(response, commentBox, anchorTags);
    } catch (error) {
        console.error("Error generating comment:", error);
        await addGeneratedTextToCommentBox("Please try again..", commentBox);
    }
}

function getPreviousCommentsOfTheUser(parent, replieeNames) {
    const commentsRepliesList = parent.querySelector('.comments-replies-list');
    if (!commentsRepliesList) {
        console.error('comments-replies-list not found');
        return;
    }
    console.log('comments list ', commentsRepliesList);

    const previousComments = [...commentsRepliesList.querySelectorAll('.comments-comment-entity')]
        .filter(option => {
            const replieeElement = option.querySelector('.comments-comment-meta__description-title');
            console.log('name ', replieeElement.textContent.trim());
            return replieeElement &&  replieeNames.includes(replieeElement.textContent.trim());
        })
        .map(option => option.querySelector('.comments-comment-item__main-content').textContent.trim());

    console.log('previous comments content ', previousComments);
    return previousComments;
}

function getMentionedUsers(commentBox) {
    const anchorTags = commentBox.querySelectorAll('.ql-mention');
    console.log('anchorTags in get ', anchorTags) // Find all the anchor tags with ql-mention class
    return Array.from(anchorTags); // Convert NodeList to an array and return it
}

function addSectionWithButton(commentBox, forReply = false) {
    const newSection = document.createElement('div');
    newSection.className = 'skoop-comment-section';
    newSection.style.margin = '0px';
    newSection.style.marginTop = '10px';
    newSection.style.display = 'flex';
    newSection.style.flexWrap = 'wrap';
    newSection.style.gap = '10px';


    buttonsList.forEach(button => {
        if (forReply) {
            const newButton = addButtonWithTypeToReply(button, commentBox);
            newSection.appendChild(newButton);
        } else {
            const newButton = addButtonWithType(button, commentBox);
            newSection.appendChild(newButton);
        }
    });

    commentBox.insertAdjacentElement('afterend', newSection);
}

function addButtonWithType(button, commentBox) {
    const newButton = document.createElement('button');
    newButton.className = 'rounded-button';
    newButton.textContent = button.title;
    newButton.style.borderRadius = '15px';
    newButton.style.height = '30px';
    newButton.style.padding = '0 15px';
    newButton.style.border = '1px solid';
    newButton.style.backgroundColor = '#089cf5';
    newButton.style.cursor = 'pointer';
    newButton.style.outline = 'none';
    newButton.style.color = 'white';
    newButton.style.fontSize = '12px';
    newButton.style.whiteSpace = 'nowrap';

    newButton.addEventListener('click', async () => {
        // Ensure we use the correct comment box for this button
        let parent = newButton.closest('.feed-shared-update-v2');
        let commentBox = parent.querySelector('.comments-comment-box--cr .comments-comment-box-comment__text-editor');
        if (commentBox) {
            let {query, postLanguage} = await createQueryForPostDescription(parent);

            if (query) {
                await makeChatGptCall(button, query, commentBox, postLanguage);
            } else {
                console.log('unabel to form a query ');
                await addLoadingMessageToCommentBox(commentBox, 'Unable to generate comment due to insufficient data');
            }

        }
    });
    return newButton;
}

function addButtonWithTypeToReply(button, commnetBox) {
    const newButton = document.createElement('button');
    newButton.className = 'rounded-button';
    newButton.textContent = button.title;
    newButton.style.borderRadius = '15px';
    newButton.style.height = '30px';
    newButton.style.padding = '0 15px';
    newButton.style.border = '1px solid';
    newButton.style.backgroundColor = '#089cf5';
    newButton.style.cursor = 'pointer';
    newButton.style.outline = 'none';
    newButton.style.color = 'white';
    newButton.style.fontSize = '12px';
    newButton.style.whiteSpace = 'nowrap';

    console.log('new button ', newButton);

    newButton.addEventListener('click', async () => {
        // Ensure we use the correct comment box for this button
        let parent = newButton.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        let postContainer = parent.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        let commentContainer = parent.querySelector('.update-components-text');
        let replyCommentBox = parent.querySelector('.comments-comment-box-comment__text-editor');
        console.log('reply comment box ', replyCommentBox);
        console.log('parent ', parent);
        console.log('comment container ', commentContainer);
        console.log('post container ', postContainer);
        
        let postQuery = ''
        if (postContainer) {
            const {query, postLanguage} = await createQueryForPostDescription(postContainer);
            console.log('query for post ', query);
            postQuery = query;
        }
        if (replyCommentBox) {
            let query = '';
            // Extract all the anchor tags (mentioned users)
            const anchorTags = getMentionedUsers(replyCommentBox);
            console.log('anchorTags in add ', anchorTags);
            const replieeNames = replyCommentBox.textContent.trim();
            console.log('repliee names ', replieeNames);
            const previousCommentsOfTheUser = getPreviousCommentsOfTheUser(parent, replieeNames);
            if (commentContainer) {
                const commentDescription = commentContainer.textContent;
                let commentLanguage = await getPostLanguage(commentDescription);
                query = `This is the description of the post: ${postQuery}\n and this is the main comment to that post: ${commentDescription}\n and this are the thread comments of the users to which you are replying: ${previousCommentsOfTheUser}. If there are no thread comments reply to the main comment but if thread comments are present consider those when replying.\n Now generate reply to the comment.`;
                console.log('comment description ', commentDescription);
                await makeChatGptCall(button, query, replyCommentBox, commentLanguage, anchorTags);
            }
        }
    });
    return newButton;
}

// Helper function to simulate a delay (e.g., 5 seconds)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// chatGpt function modified to accept the AbortSignal and handle abortion
async function chatGpt(type, query, signal) {

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
                    console.error(chrome.runtime.lastError);
                    reject(new Error('Failed to generate comment. Please try again'));
                } else {
                    console.log("Response from background:", response);
                    if (response) {
                        resolve(response);
                    } else {
                        reject(new Error('Encountered some issue. Please try again.'));
                    }
                }
            });
    });
}

async function getPostLanguage(postDescription) {
    return new Promise((resolve, reject) => {
        // Send message to background script, passing the signal to abort the request
        chrome.runtime.sendMessage({
            action: 'detectLanguage',
            query: postDescription,
        },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    reject(new Error('Failed to generate comment. Please try again'));
                } else {
                    console.log("Response from background:", response);
                    if (response) {
                        resolve(response);
                    } else {
                        reject(new Error('Encountered some issue. Please try again.'));
                    }
                }
            });
    });
}

// async function verifyUser() {
//     return new Promise((resolve, reject) => {
//         chrome.runtime.sendMessage({
//             action: 'verifyToken',
//         },
//             (response) => {
//                 if (chrome.runtime.lastError) {
//                     console.error(chrome.runtime.lastError);
//                     reject(new Error('Failed to verify token. Please try again'));
//                 } else {
//                     console.log("Response from background:", response);
//                     resolve(response);
//                 }
//             });
//     });
// }

async function addGeneratedTextToCommentBox(response, commentBox, anchorTags = []) {
    console.log('generated text printing')
    await addTextToCommentBox(response, commentBox, anchorTags);
    return;
}

async function addLoadingMessageToCommentBox(commentBox, message) {
    console.log('loading message printing ');
    await addTextToCommentBox(message, commentBox);
    return;

}

// function getFullLanguageName(name) {
//     console.log('language name in getFull ', name);
//     switch(name) {
//         case `"hi"`:
//             return 'Hindi';
//         default:
//             return name;
//     }
// }

// Function to type text into the comment box
async function addTextToCommentBox(response, commentBox, anchorTags = []) {
    if (commentBox) {
        let editor = commentBox.querySelector('.ql-editor');
        if (editor) {
            let index = 0;
            editor.textContent = ''; // Clear the editor content before typing starts
            console.log('anchor tags in add text ', anchorTags);
            // Append anchor tags (names) first before the response text
            anchorTags.forEach(anchor => {
                editor.appendChild(anchor.cloneNode(true)); // Clone the anchor element and append it to the editor
                editor.appendChild(document.createTextNode(' ')); // Add a space after each anchor
            });

            // Typing simulation
            const typeEffect = () => {
                if (index < response.length) {
                    editor.textContent += response.charAt(index); // Append each character to the editor's textContent
                    index++;
                    setTimeout(typeEffect, 20); // Adjust typing speed here
                }
            };

            return new Promise(resolve => {
                const finishTyping = () => {
                    if (index >= response.length) {
                        resolve(); // Resolve the promise when typing finishes
                    } else {
                        setTimeout(finishTyping, 20);
                    }
                };

                typeEffect(); // Start typing effect
                finishTyping(); // Monitor when typing finishes
            });
        } else {
            console.log('Editor not found inside the comment box');
        }
    } else {
        console.log('Comment box not found');
    }
}

processReplyCommentBoxes();

function processReplyCommentBoxes() {
    console.log('processReplyCommentBoxes got called');
    // let replies = document.getElementsByClassName('comments-comment-social-bar__reply-action-button--cr');
    // console.log('replies are ', replies);
    // Array.from(replies).forEach((replyButton) => {
    //     console.log('reply button before if ', replyButton);

    //         replyButton.addEventListener('click', async () => {
    //             console.log('reply button ', replyButton);
    //             const commentContainer = replyButton.querySelector('.comments-comment-list__container');

    //             // Find the corresponding reply box
    //             const replyBox = commentContainer.querySelector('.comments-comment-box__form');
    //             if (replyBox) {
    //                 // Check if buttons have already been added to avoid duplication
    //                 if (!replyBox.parentElement.querySelector('.skoop-comment-section')) {
    //                     addSectionWithButton(replyBox);

    //                     // Generate text based on the current comment content
    //                     const commentContent = commentContainer.querySelector('.comments-comment-item__main-content').textContent.trim();
    //                     //generateTextInReplyBox(replyBox, commentContent);
    //                 }
    //             } else {
    //                 console.error('comments-comment-box not found');
    //             }
    //         });
    // });
    document.body.addEventListener('click', function (event) {
        if (event.target.closest('.comments-comment-social-bar__reply-action-button--cr')) {
            let replyButton = event.target.closest('.comments-comment-social-bar__reply-action-button--cr');
            const commentContainer = replyButton.closest('.comments-comment-list__container');

            // Find the corresponding reply box
            const replyBox = commentContainer.querySelector('.comments-comment-texteditor');
            if (replyBox) {
                // Check if buttons have already been added to avoid duplication
                if (!replyBox.parentElement.querySelector('.skoop-comment-section')) {
                    addSectionWithButton(replyBox, true);

                    // Generate text based on the current comment content
                    const commentContent = commentContainer.querySelector('.comments-comment-item__main-content').textContent.trim();
                    //generateTextInReplyBox(replyBox, commentContent);
                }
            }
        }
    });
}