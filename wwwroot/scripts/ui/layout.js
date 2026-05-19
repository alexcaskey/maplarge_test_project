export function createLayout() {
    const root = document.getElementById("app") || document.body;

    root.innerHTML = `
        <header>
            <hgroup>
                <h1>File Browser</h1>
            </hgroup>
        </header>
        <main class="container">
            <div id="search-bar-wrapper">
                <input name="search" id="search-input" type="text" placeholder="Search files names..." autocomplete="off">
                <button id="search-btn">Search</button>
                <button class="secondary" id="search-reset">Reset</button>
            </div>

            <div id="search-results">
                <h3>Search Results...</h3>
                <div id="search-listing"></div>
                <div id="searchFileCount"></div>
                <div id="searchFileSize"></div>
            </div>

            <div id="layout">
                <aside id="tree">
                    <ul>

                    </ul>
                </aside>

                <section id="content">
                    <h3 id="folderName"></h3>
                    <div id="listing"></div>
                    <div id="fileCount"></div>
                    <div id="directorySize"></div>
                </section>

                <aside id="actions">
                    <div id="upload-wrapper"><img src="images/upload.png" alt="Upload Files"><span>Drop files to upload</span>
                    </div>
                    <div id="trash-wrapper"><img src="images/trash.png" alt="Trash"><span>Drop files to delete</span></div>
                </aside>

            </div>

        </main>
        <footer>
            <p>&copy; 2026 File Browser. All rights reserved.</p>
        </footer>
    `;
}
