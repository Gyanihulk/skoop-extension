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
    let buttons = ['New Insight', 'Bright Notion', 'Quick Thought'];
    const newSection = document.createElement('div');
    newSection.className = 'skoop-comment-section';
    newSection.style.margin = '5px 20px 10px 55px';
    newSection.style.display = 'flex';
    newSection.style.flexWrap = 'wrap';
    newSection.style.gap = '10px';

    buttons.forEach(button => {
        const newButton = addButtonWithType(button, commentBox);
        newSection.appendChild(newButton);
    });

    commentBox.insertAdjacentElement('afterend', newSection);
}

function addButtonWithType(text, commentBox) {
    const newButton = document.createElement('button');
    newButton.className = 'rounded-button';
    newButton.textContent = text;
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
            if (descriptionContainer) {
                let content = descriptionContainer.textContent;
                addLoadingMessageToCommentBox(commentBox);
                if (content) {
                    try {
                        const response = await chatGpt(text, content);
                        addGeneratedTextToCommentBox(response, commentBox);
                    } catch (error) {
                        console.error("Error generating comment:", error);
                        addGeneratedTextToCommentBox("Please try again..");
                    }
                }
            }
        }
    });
    return newButton;
}

async function chatGpt(type, query) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            action: 'generateCommentCGPT',
            type: type,
            query: query,
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

function addGeneratedTextToCommentBox(response, commentBox) {
    addTextToCommentBox(response, commentBox);
    return;
}

function addLoadingMessageToCommentBox(commentBox) {
    addTextToCommentBox("Reading the post...", commentBox);
    return;
    
}

function addTextToCommentBox(response, commentBox) {
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

            typeEffect(); // Start typing effect
            return;
        } else {
            console.log('Editor not found inside the comment box');
            return;
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