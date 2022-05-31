module.exports = (io, socket) => {
  // 每個連線者各自的登記表
  let registerBook;

  // 登記每個連線者目前頁面顯示的貼文
  socket.on("register", (postIds) => {
    const idSet = new Set();
    for (const id of postIds) {
      idSet.add(id);
    }
    registerBook = idSet;
  });

  // 通知有該貼文的連線者，於該貼文增加留言
  socket.on("createComment", (comment) => {
    if (registerBook.has(comment.postId)) {
      io.emit("addComment", comment);
    }
  });

  // 通知有該貼文的連線者，移除留言
  socket.on("deleteComment", (data) => {
    if (registerBook.has(data.postId)) {
      io.emit("removeComment", {
        postId: data.postId,
        commentId: data.commentId,
      });
    }
  });

  // 通知有該貼文的連線者，變更其按讚數
  socket.on("changeLikeCount", ({ postId, likeCount }) => {
    if (registerBook.has(postId)) {
      io.emit("updateLikeCount", { postId, likeCount });
    }
  });
};
