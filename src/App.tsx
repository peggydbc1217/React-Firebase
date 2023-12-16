import { useEffect } from "react";
import "./App.css";
import Auth from "./components/Auth";
import { auth } from "./config/firebase";
import { db } from "./config/firebase";
import { getDocs } from "firebase/firestore";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore"; // Import the functions you need from the SDKs you need
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { storage } from "./config/firebase";

import { useState } from "react";
import { useCallback } from "react";

interface Movie {
  id: string;
  receivedAnOscar: boolean;
  releaseDate: string;
  title: string;
}

function App() {
  const [movieList, setMovieList] = useState<Movie[]>([]);

  //new movie state
  const [newMovieTitle, setNewMovieTitle] = useState<string>("");
  const [newMovieReleaseDate, setNewMovieReleaseDate] = useState<number>(0);
  const [newMovieReceivedAnOscar, setNewMovieReceivedAnOscar] =
    useState<boolean>(false);

  //update title state
  const [updateMovieTitle, setUpdateMovieTitle] = useState<string>("");

  //File upload state
  const [file, setFile] = useState<File | null>(null);

  const moviesCollectionRef = collection(db, "movies");

  //create
  const getMovieList = useCallback(async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filterdData = data.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        } as Movie;
      });
      setMovieList(filterdData);
    } catch (error) {
      console.log(error);
    }
  }, [moviesCollectionRef]);

  useEffect(() => {
    //read
    getMovieList();
  }, [getMovieList]);

  //create
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newMovieReleaseDate,
        receivedAnOscar: newMovieReceivedAnOscar,
        //uid is the user id that firebase gives to each user
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (error) {
      console.log(error);
    }
  };

  //delete
  const deleteMovie = async (id: string) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
      getMovieList();
    } catch (error) {
      console.log(error);
    }
  };

  //update
  const handleUpdate = async (id: string) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await updateDoc(movieDoc, { title: updateMovieTitle });
      getMovieList();
    } catch (error) {
      console.log(error);
    }
  };

  //upload file
  const handleUploadFile = async () => {
    try {
      if (!file) return;
      const storageRef = ref(storage, `folder/${file.name}`);
      await uploadBytes(storageRef, file);

      console.log("File uploaded!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {auth?.currentUser?.email && <div>Hi!{auth?.currentUser?.email}</div>}
      <Auth></Auth> {/* Render the Auth component */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="movie title"
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="release date"
          onChange={(e) => setNewMovieReleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          title="oscar"
          onChange={(e) => setNewMovieReceivedAnOscar(e.target.checked)}
        />
        <label htmlFor="oscar">Received an oscar</label>
        <button type="submit">Add movie</button>
      </form>
      {movieList.map((movie) => {
        // For each movie in the movieList array...
        // console.log(movie);

        return (
          <>
            <div>{movie.title}</div>
            <div>{movie.releaseDate}</div>
            <div>{movie.receivedAnOscar ? "tewr" : "false"}</div>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>

            <input
              placeholder="newtitle"
              type="text"
              onChange={(e) => setUpdateMovieTitle(e.target.value)}
            ></input>
            <button onClick={() => handleUpdate(movie.id)}>Update</button>

            <div className="">
              <input
                type="file"
                title="file"
                placeholder="sunbmit a file"
                onChange={(e) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
              <button onClick={handleUploadFile}>Submit a file</button>
            </div>
          </>
        );
      })}
    </>
  );
}

export default App;
