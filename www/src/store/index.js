import vue from "vue";
import vuex from "vuex";
import axios from "axios";

var api = axios.create({
    baseURL: "//localhost:3000/api/",
    timeout: 5000
});

vue.use(vuex);

export default new vuex.Store({
    state: {
        user: {
            name: "testUser"
        },
        posts: [],
        comments: {},
        replies: []
        // tabling votes for now until vote key is added to Post model
    },
    mutations: {
        setPosts(state, payload) {
            state.posts = payload;
        },
        setComments(state, payload) {
            vue.set(state.comments, payload.postId, payload.comments || [])
        },
        setUser(state, payload) {
            state.user = payload;
        },
        setReplies(state, payload) {
            state.replies = payload;
        }

    },
    actions: {
        // GET ALL POSTS
        getPosts({ commit, dispatch }) {
            api
                .get("posts/")
                .then(res => {
                    console.log(res);
                    commit("setPosts", res.data);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // GET ALL COMMENTS ON A POST
        getComments({ commit, dispatch }, payload) {
            api
                .get("posts/" + payload._id + "/comments")
                .then(res => {
                    console.log(res);
                    commit("setComments", { postId: payload._id, comments: res.data });
                });
        },
        // GET ALL REPLIES ON A COMMENT
        getReplies({ commit, dispatch }, payload) {
            api
                .get("posts/" + payload.postId + "/comments/" + payload.commentId + "/replies")
                .then(res => {
                    console.log(res);
                    commit("setReplies", res.data);
                });
        },
        // GET USER
        getUser({ commit, dispatch }, payload) {
            api
                .get("users")
                .then(res => {
                    console.log(res);
                    commit("setUsers", res.data);
                });
        },
        // PLEASE WRITE:
        // putVotes(),

        // ADD A POST
        addPost({ commit, dispatch }, payload) {
            api
                .post("posts", payload)
                .then(res => {
                    dispatch("getPosts");
                });
        },
        // ADD A COMMENT
        addComment({ commit, dispatch }, payload) {
            console.log(payload.postId);
            api
                .post("posts/" + payload.postId + "/comments", payload)
                .then(res => {
                    dispatch("getComments", { _id: res.data.postId });
                });
        },
        //ADD A REPLY
        addReply({ commit, dispatch }, payload) {
            api
                .post("posts/" + payload.postId + "/comments" + payload.commentId + "/replies", payload)
                .then(res => {
                    dispatch("getReplies", res.data);
                });
        },
        //DELETE A POST
        removePost({ commit, dispatch }, payload) {
            api
                .delete("posts/" + payload.postId)
                .then(res => {
                    dispatch("getPosts");
                });
        },
        //DELETE A COMMENT
        removeComment({ commit, dispatch }, payload) {
            api
                .delete("posts/" + payload.postId + "/comments" + payload.commentId)
                .then(res => {
                    dispatch("getComments");
                });
        },
        //DELETE A REPLY
        removeReply({ commit, dispatch }, payload) {
            api
                .delete("posts/" + payload.postId + "/comments" + payload.commentId + "replies" + payload._id)
                .then(res => {
                    dispatch("getReplies");
                });
        },
        //UPDATE A POST
        updatePost({ commit, dispatch }, payload) {
            api
                .put("posts/" + payload.postId, payload)
                .then(res => {
                    dispatch("getPosts");
                });
        },
        //UPDATE A COMMENT
        updateComment({ commit, dispatch }, payload) {
            api
                .put("posts/" + payload.postId + "/comments" + payload.commentId, payload)
                .then(res => {
                    dispatch("getComments");
                });
        },
        //UPDATE A REPLY
        updateReply({ commit, dispatch }, payload) {
            api
                .put("posts/" + payload.postId + "/comments" + payload.commentId + "replies" + payload._id, payload)
                .then(res => {
                    dispatch("getReplies");
                });
        }
    }
});