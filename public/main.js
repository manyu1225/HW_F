const socket = io();

const posts = [
  {
    _id: "628909974247c44568d85428",
    content: "我是廢文 我是廢文 我是廢文 我是廢文",
    user: "使用者",
    comments: [],
  },
  {
    _id: "628909b34247c44568d8542b",
    content: "xxxxxxxxxxxxxxxx我是廢文 我是廢文 我是廢文 我是廢文",
    user: "使用者",
    comments: [],
  },
  {
    _id: "6289d155d555b60de6179f9b",
    content: "我是廢文~~~~~~",
    user: "使用者",
    comments: [],
  },
  {
    _id: "6289d24dd555b60de6179fad",
    content: "我是廢文...........",
    user: "使用者",
    comments: [],
  },
];

const postIds = posts.map((post) => post._id);

window.onload = () => {
  // 初始化留言
  (function () {
    posts.forEach((post) => {
      outputPost(post);

      post.comments.forEach((comment) => {
        outputComment(comment);
      });
    });
  })();

  socket.on("connect", () => {
    console.log("socket connected", socket.connected); // true

    socket.emit("register", postIds);
  });

  const postIdInput = document.getElementById("postIdInput");
  const commentInput = document.getElementById("commentInput");
  const commentBtn = document.getElementById("commentBtn");

  commentBtn.addEventListener("click", (e) => {
    socket.emit("createComment", {
      postId: postIdInput.value,
      content: commentInput.value,
      user: socket.id.slice(0, 4),
    });
  });

  socket.on("addComment", (comment) => {
    outputComment(comment);
  });
};

function outputPost(post) {
  const li = document.createElement("li");
  li.innerHTML = `
    <strong>${post.user}:</strong>
    <div>${post.content}</div>
    <ol id="${post._id}"></ol>
  `;
  document.getElementById("output").appendChild(li);
}

function outputComment(comment) {
  const ol = document.getElementById(comment.postId);
  const li = document.createElement("li");
  li.innerHTML = `
    <strong>${comment.user}:</strong>
    <span>${comment.content}</span>
  `;
  ol.appendChild(li);
}
