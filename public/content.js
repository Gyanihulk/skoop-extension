const targetNode = document.body;
const config = { childList: true, subtree: true };

const callback = function(mutationsList, observer) {
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType == 1 && node.classList.contains('feed-skip-link__container')) {
                    processCommentBoxes()
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
            commentButton.addEventListener('click', () => {
                let parent = commentButton.parentElement.parentElement.parentElement.parentElement
                let commentBox = parent.querySelector('.feed-shared-update-v2__comments-container').querySelector('.comments-comment-box')
                if (commentBox) { 
                    const buttonSection = commentBox.parentElement.querySelector('.skoop-comment-section');
                    if (!buttonSection) {
                        addSectionWithButton(commentBox);
                    }
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
    let buttons = ['New Insight', 'Bright Notion', 'Quick Thought']
    const newSection = document.createElement('div');
    newSection.className = 'skoop-comment-section' ;
    newSection.style.margin = '5px 20px 10px'
    newSection.style.display = 'flex';
    newSection.style.gap = '10px';
    
    buttons.forEach(button => {
        newButton = addButtonWithType(button, commentBox)
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
    newButton.style.backgroundColor = '#2d68c4';
    newButton.style.cursor = 'pointer';
    newButton.style.outline = 'none';
    newButton.style.color = 'white';

    newButton.addEventListener('click', () => {
        let postContainer = commentBox.parentElement.parentElement.parentElement;
        if (postContainer) {
            let descriptionContainer = postContainer.querySelector('.feed-shared-update-v2__description-wrapper');
            if (descriptionContainer) {
                let content = descriptionContainer.textContent
                if (content) {
                    chatGpt(text, content);
                }
            }
        }
    });
    return newButton;
}


function chatGpt(type, query) {
    chrome.runtime.sendMessage({
            action: 'generateCommentCGPT',
            type: type, 
            query: query,
        },
        (response) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            } else {
            console.log("Response from background:", response);
            }        
        }
    );
}
