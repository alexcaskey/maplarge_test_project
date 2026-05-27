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

      <button class="secondary" id="logout-btn">Logout</button>
    </aside>

  </div>

</main>
<footer>
  <p>&copy; 2026 File Browser. All rights reserved.</p>
</footer>
<dialog id="login-modal">
  <article>
    <header>
      <button aria-label="Close" rel="prev" data-target="modal-example" onclick="toggleModal(event)"></button>
      <h3>Login to Browse File!</h3>
    </header>
    <p>
      <input type="text" name="username" id="username" placeholder="User Name" aria-label="Username"
        autocomplete="username">
      <input type="password" name="password" id="password" placeholder="Password" aria-label="Password">
    </p>
    <footer>
      <button autofocus data-target="modal-login" id="modal-login">
        Login
      </button>
    </footer>
  </article>
</dialog>
    `;
}
