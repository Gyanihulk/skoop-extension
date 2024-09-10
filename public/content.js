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
                    //processReplyCommentBoxes();
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
                let parent = commentButton.parentElement.parentElement.parentElement.parentElement
                let commentBox = parent.querySelector('.feed-shared-update-v2__comments-container').querySelector('.comments-comment-box--cr')
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


function addSectionWithButton(commentBox) {
    // let buttons = ['New Insight', 'Bright Notion', 'Quick Thought'];
    const newSection = document.createElement('div');
    newSection.className = 'skoop-comment-section';
    newSection.style.margin = '5px 20px 10px 55px';
    newSection.style.display = 'flex';
    newSection.style.flexWrap = 'wrap';
    newSection.style.gap = '10px';


    buttonsList.forEach(button => {
        const newButton = addButtonWithType(button, commentBox);
        newSection.appendChild(newButton);
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
            let descriptionContainer = parent.querySelector('.feed-shared-update-v2__description-wrapper');
            let pollContainer = parent.querySelector('.update-components-poll');
            let query = '';
            let entityContainer = parent.querySelector('.update-components-entity');
            let eventContainer = parent.querySelector('.update-components-event');
            let celebrationContainer = parent.querySelector('.update-components-celebration');
            let articleContainer = parent.querySelector('.update-components-article');
            let repostContainer = parent.querySelector('.feed-shared-update-v2__update-content-wrapper');
            let postLanguage = 'en';
            console.log('repost container ', repostContainer);
            //let imageContainer = parent.querySelector('.update-components-image');
            
            if(repostContainer) {
                let repostDescription = repostContainer.querySelector('.feed-shared-update-v2__description') ? repostContainer.querySelector('.feed-shared-update-v2__description').textContent : 'original post has no description' ;

                if (descriptionContainer) {
                    const content = descriptionContainer.textContent;
                    query = `Use the repost description as context to craft a reply to the current post. Here’s the repost description: \n ${repostDescription} \n and here’s the current post description: \n ${content}.\
                    Please create a response that connects both.`;
                } else {
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

            // For images -- not working
            // if (imageContainer) {
            //     let imageSrc = imageContainer.querySelector('img').src;
            //     let imageAlt = imageContainer.querySelector('img').alt;
            
            //     query = query + `\n\nThe post includes an image with the following details: Image URL: ${imageSrc}. Alt text: ${imageAlt}.\
            //     So while generating the comment consider this image`;
            // }

            if (query) {
                query = query + `\n\n${button.prompt}\nKeep it under ${button.length}. And use ${button.tone} tone.\n You should reply in the ${postLanguage} language.`;
                // Display initial loading message
                await addLoadingMessageToCommentBox(commentBox, "Reading the post...");

                // Create an AbortController
                const controller = new AbortController();
                const { signal } = controller;
    
                // Set up a timeout to update the loading message after 5000ms -- 5 seconds
                const timeout5s = setTimeout(() => {
                    addLoadingMessageToCommentBox(commentBox, "Taking more time than expected, please wait...");
                }, 5000);
    
                // Set up a timeout to stop the request after 13000ms -- 13 seconds
                const timeout13s = setTimeout(() => {
                    controller.abort();  // Abort the ChatGPT request
                    addLoadingMessageToCommentBox(commentBox, "Something has happened, please try again. If it presists, please refresh the page.");
                    console.error('ChatGPT request stopped due to timeout.');
                }, 13000);

                try {
                    const processStartTime = Date.now();
                         
                    const response = await chatGpt(button.title, query, signal);
 
                    if (response) {
                        const processEndTime = Date.now();
                        console.log('Time taken to get the response from the backend:', processEndTime - processStartTime);

                        // Clear all timeouts if the response arrives before 13 seconds
                        clearTimeout(timeout5s);
                        clearTimeout(timeout13s);
                    }

                    // Add the generated response to the comment box
                    await addGeneratedTextToCommentBox(response, commentBox);   
                } catch (error) {
                    console.error("Error generating comment:", error);
                    await addGeneratedTextToCommentBox("Please try again..", commentBox);
                }
            } else {
                console.log('unabel to form a query ');
                await addLoadingMessageToCommentBox(commentBox, 'Unable to generate comment due to insufficient data');
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

async function addGeneratedTextToCommentBox(response, commentBox) {
    console.log('generated text printing')
    await addTextToCommentBox(response, commentBox);
    return;
}

async function addLoadingMessageToCommentBox(commentBox, message) {
    console.log('loading message printing ');
    await addTextToCommentBox(message, commentBox);
    return;
    
}

// Function to type text into the comment box
async function addTextToCommentBox(response, commentBox) {
    if (commentBox) {
        let editor = commentBox.querySelector('.ql-editor');
        if (editor) {
            let index = 0;
            editor.textContent = ''; // Clear the editor content before typing starts

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

// processReplyCommentBoxes();

// function processCommentBoxes() {
//     document.body.addEventListener('click', function(event) {
//         if (event.target.closest('.comments-comment-social-bar__reply-action-button--cr')) {
//             const replyButton = event.target.closest('.comments-comment-social-bar__reply-action-button--cr');
//             const commentContainer = replyButton.closest('.comments-comment-list__container');
            
//             // Find the corresponding reply box
//             const replyBox = commentContainer.querySelector('.comments-comment-box--reply');
//             if (replyBox) {
//                 // Check if buttons have already been added to avoid duplication
//                 if (!replyBox.querySelector('.skoop-comment-section')) {
//                     addSectionWithButton(replyBox);

//                     // Generate text based on the current comment content
//                     const commentContent = commentContainer.querySelector('.comments-comment-item__main-content').textContent.trim();
//                     generateTextInReplyBox(replyBox, commentContent);
//                 }
//             }
//         }
//     });
// }