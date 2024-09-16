"use strict";
const blogpostMarkdown = `# control

*humans should focus on bigger problems*

## Setup

\`\`\`bash
git clone git@github.com:anysphere/control
\`\`\`

\`\`\`bash
./init.sh
\`\`\`

## Folder structure

**The most important folders are:**

1. \`vscode\`: this is our fork of vscode, as a submodule.
2. \`milvus\`: this is where our Rust server code lives.
3. \`schema\`: this is our Protobuf definitions for communication between the client and the server.

Each of the above folders should contain fairly comprehensive README files; please read them. If something is missing, or not working, please add it to the README!

Some less important folders:

1. \`release\`: this is a collection of scripts and guides for releasing various things.
2. \`infra\`: infrastructure definitions for the on-prem deployment.
3. \`third_party\`: where we keep our vendored third party dependencies.

## Miscellaneous things that may or may not be useful

##### Where to find rust-proto definitions

They are in a file called \`aiserver.v1.rs\`. It might not be clear where that file is. Run \`rg --files --no-ignore bazel-out | rg aiserver.v1.rs\` to find the file.

## Releasing

Within \`vscode/\`:

- Bump the version
- Then:

\`\`\`
git checkout build-todesktop
git merge main
git push origin build-todesktop
\`\`\`

- Wait for 14 minutes for gulp and ~30 minutes for todesktop
- Go to todesktop.com, test the build locally and hit release
`;
let currentContainer = null;
// Do not edit this method
function runStream() {
    currentContainer = document.getElementById('markdownContainer');
    // this randomly split the markdown into tokens between 2 and 20 characters long
    // simulates the behavior of an ml model thats giving you weirdly chunked tokens
    const tokens = [];
    let remainingMarkdown = blogpostMarkdown;
    while (remainingMarkdown.length > 0) {
        const tokenLength = Math.floor(Math.random() * 18) + 2;
        const token = remainingMarkdown.slice(0, tokenLength);
        tokens.push(token);
        remainingMarkdown = remainingMarkdown.slice(tokenLength);
    }
    const toCancel = setInterval(() => {
        const token = tokens.shift();
        if (token) {
            addToken(token);
        }
        else {
            clearInterval(toCancel);
        }
    }, 20);
}
// dont be afraid of using globals for state
function handleAddInlineBlock() {
}
/*YOUR CODE HERE
this does token streaming with no styling right now
your job is to write the parsing logic to make the styling work
 */
let globalBackTicks = 0;
let isInBlock = false;
let isInInline = false;
let backtickBuffer = '';
let tempContent = '';
let blockDiv = null;
function addToken(token) {
    if (!currentContainer)
        return;
    for (let char of token) {
        if (char === "#") {
            let headingLevel = 0;
            while (token[headingLevel] === "#") {
                headingLevel++;
            }
            const heading = document.createElement(`h${headingLevel}`);
            heading.innerText = token.slice(headingLevel).trim();
            currentContainer.appendChild(heading);
        }
        else if (char === "`") {
            globalBackTicks++;
            if (globalBackTicks === 3) {
                if (blockDiv !== null) {
                    blockDiv = null;
                }
                else {
                    blockDiv = document.createElement('div');
                    blockDiv.style.backgroundColor = 'lightgray';
                    blockDiv.style.padding = '10px';
                    blockDiv.style.borderRadius = '5px';
                    currentContainer.appendChild(blockDiv);
                }
                globalBackTicks = 0;
            }
        }
        else if (char === "*") {
            if (isInInline) {
                isInInline = false;
                const inlineSpan = document.createElement('span');
                inlineSpan.innerText = backtickBuffer;
                inlineSpan.style.fontWeight = 'bold';
                currentContainer.appendChild(inlineSpan);
                backtickBuffer = '';
            }
            else {
                isInInline = true;
            }
        }
        else {
            if (blockDiv !== null) {
                tempContent += char;
            }
            else if (isInInline) {
                backtickBuffer += char;
            }
            else {
                const span = document.createElement('span');
                if (globalBackTicks == 1) {
                    span.style.backgroundColor = 'lightgray';
                }
                span.innerText = char;
                currentContainer.appendChild(span);
            }
        }
    }
    if (blockDiv !== null && tempContent) {
        const blockSpan = document.createElement('span');
        blockSpan.innerText = tempContent;
        blockDiv.appendChild(blockSpan);
        tempContent = '';
    }
}
//# sourceMappingURL=MarkdownParser.js.map