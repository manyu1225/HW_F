const { server } = require("http");
const io = require("socket.io")(server);

const feedNsp = io.of("/feeds"); // 全體動態牆

feedNsp.on("connection", (socket) => {
  let registerPostIds = [];

  // 登記目前頁面的顯示的貼文，是否更新留言的依據
  socket.on("register", (postIds) => {
    registerPostIds = registerPostIds.concat(postIds);
  });

  /**  貼文 post  */

  // 通知所有連線者，增加新貼文
  socket.on("createPost", (post) => {
    registerPostIds.push(post._id);
    feedNsp.emit("addPost", post);
  });

  // 通知所有連線者，移除貼文
  socket.on("deletePost", (postId) => {
    const idx = registerPostIds.findIndex((id) => id === postId);
    registerPostIds.splice(idx, 1);
    feedNsp.emit("removePost", postId);
  });

  /**  留言 comment  */

  // 通知有該貼文的連線者，在該貼文增加留言
  socket.on("createComment", (comment) => {
    if (registerPostIds.includes(comment.postId)) {
      feedNsp.emit("addComment", comment);
    }
  });

  // 通知有該貼文的連線者，移除留言
  socket.on("deleteComment", (comment) => {
    if (registerPostIds.includes(comment.postId)) {
      feedNsp.emit("removeComment", { postId: comment.postId, commentId });
    }
  });

  socket.on("disconnect", (socket) => {
    registerPostIds = [];
  });
});
