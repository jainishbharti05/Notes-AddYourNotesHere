// import axios from "../apis/axios";
import {
  firebaseTasks,
  firebaseNotes,
  firebaseLooper,
  firebaseDB,
} from "../firebase";
import history from "../history";

export const signIn = (userId, userName, givenName) => {
  return {
    type: "SIGN_IN",
    payload: { userId, userName, givenName },
  };
};

export const signOut = () => {
  return {
    type: "SIGN_OUT",
  };
};

// TASK ACTION CREATER

export const createTask = (formValues, isCompleted) => (dispatch, getState) => {
  const { userId } = getState().auth;
  const dataToSubmit = {
    ...formValues,
    isCompleted,
    userId,
  };

  firebaseTasks.limitToLast(1).once("value", (snapshot) => {
    let prevTaskId = 0;
    snapshot.forEach((childSnapshot) => {
      prevTaskId = childSnapshot.val().id;
    });    
    dataToSubmit["id"] = prevTaskId + 1;
  });

  firebaseTasks.push(dataToSubmit).once("value", (snapshot) => {
    const response = snapshot.val();

    dispatch({ type: "CREATE_TASK", payload: response });
  });
  history.push('/tasks')
};

export const fetchTasks = () => (dispatch) => {
  firebaseTasks.on("value", (snapshot) => {
    const response = firebaseLooper(snapshot);

    dispatch({ type: "FETCH_TASKS", payload: response });
  });
};

export const modifyTask = (formValues, id) => (dispatch) => {
  let key = null;

  firebaseTasks
    .orderByChild("id")
    .equalTo(id)
    .once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        key = childSnapshot.key;
      });
    });

  firebaseDB.ref(`tasks/${key}`).update({
    isCompleted: formValues.isCompleted,
  });

  let response = {};
  firebaseDB.ref(`tasks/${key}`).once("value", (snapshot) => {
    response = snapshot.val();

    dispatch({ type: "MODIFY_TASK", payload: response });
  });
};

export const deleteTask = (id) => (dispatch) => {
  let key = null;
  const taskId = id;

  firebaseTasks
    .orderByChild("id")
    .equalTo(id)
    .once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        key = childSnapshot.key;
      });
    });

  firebaseDB
    .ref(`tasks/${key}`)
    .remove()
    .then(() => {
      dispatch({
        type: "DELETE_TASK",
        payload: taskId,
      });
    });
};
// NOTES ACTION_CREATER

export const createNote = (formValues) => (dispatch, getState) => {
  const { userId } = getState().auth;
  let dataToSubmit = {
    ...formValues,
    userId,
  };

  firebaseNotes.limitToLast(1).once("value", (snapshot) => {
    let prevNoteId = 0;
    snapshot.forEach((childSnapshot) => {
      prevNoteId = childSnapshot.val().id;
    });
    dataToSubmit["id"] = parseInt(prevNoteId) + 1;
    console.log(dataToSubmit.id);
    
    // dataToSubmit["id"] = prevNoteId + 1;

  });

  firebaseNotes.push(dataToSubmit).once("value", (snapshot) => {
    const response = snapshot.val();

    dispatch({ type: "CREATE_NOTE", payload: response });
    history.push("/notes");
  });
};

export const fetchNotes = () => (dispatch) => {
  firebaseNotes.on("value", (snapshot) => {
    const response = firebaseLooper(snapshot);

    dispatch({ type: "FETCH_NOTES", payload: response });
  });
};

export const fetchNote = (id) => (dispatch) => {
  let key = null;
  // const noteId = id;
  const noteId = parseInt(id);

  firebaseNotes
    .orderByChild("id")
    .equalTo(noteId)
    .once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        key = childSnapshot.key;
      });
    });

  firebaseDB.ref(`notes/${key}`).once("value", (snapshot) => {
    const response = snapshot.val();

    dispatch({ type: "FETCH_NOTE", payload: response });
  });
};

export const modifyNote = (id, formValues) => (dispatch) => {
  let key = null;

  firebaseNotes
    .orderByChild("id")
    .equalTo(parseInt(id))
    .once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        key = childSnapshot.key;
      });
    });

  firebaseDB.ref(`notes/${key}`).update({
    note: formValues.note,
  });

  let response = {};
  firebaseDB.ref(`notes/${key}`).once("value", (snapshot) => {
    response = snapshot.val();

    dispatch({ type: "MODIFY_NOTE", payload: response });
  });
  history.push("/notes");
};

export const deleteNote = (id) => (dispatch) => {
  let key = null;
  // let noteId = parseInt(id)
  const noteId = id;

  firebaseNotes
    .orderByChild("id")
    // .equalTo(noteId)
    .equalTo(id)
    .once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        key = childSnapshot.key;
      });
    });

  firebaseDB
    .ref(`notes/${key}`)
    .remove()
    .then(() => {
      dispatch({
        type: "DELETE_NOTE",
        payload: noteId
      });
    });
};
