import initializeApplication from "../firebase/firebase.init"
import { useEffect, useState } from "react"
import { getAuth, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";


initializeApplication()
const useFirebase = () => {
    const [user, setUser] = useState({});
    const [admin, setAdmin] = useState(false)
    const [authError, setAuthError] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    const auth = getAuth()
    const GoogleProvider = new GoogleAuthProvider()

    const registerUser = (email, password, name, history) => {
        setIsLoading(true)
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setAuthError('');
                const newUser = { email, displayName: name }
                setUser(newUser);
                //save user to database
                saveUser(email, name, 'POST')
                //send name to firebase
                updateProfile(auth.currentUser, {
                    displayName: name
                })
                    .then(() => {
                        // Profile updated!
                        // ...
                    })
                    .catch((error) => {
                        // An error occurred
                        // ...
                    });
                history.replace("/");
                window.location.reload()
            })
            .catch((error) => {
                setAuthError(error.message)
            })
            .finally(() => setIsLoading(false))
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
                setUser({})
            }
            setIsLoading(false)
        })
        return () => unsubscribe;
    }, []);

    const loginUser = (email, password, location, history) => {
        setIsLoading(true)
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const destination = location?.state?.from || "/";
                history.replace(destination);
                setAuthError('')
            })
            .catch((error) => {
                setAuthError(error.message)
            })
            .finally(() => setIsLoading(false))

    }

    const googleLogin = (location, history) => {
        setIsLoading(true)
        signInWithPopup(auth, GoogleProvider)
            .then((result) => {
                const user = result.user;
                //save user to database
                saveUser(user.email, user.displayName, 'PUT');
                const destination = location?.state?.from || "/";
                history.replace(destination);
                setAuthError('')
            })
            .catch((error) => {
                setAuthError(error.message)
            })
            .finally(() => setIsLoading(false))
    }
    useEffect(() => {
        fetch(`https://blooming-refuge-00817.herokuapp.com/users/${user?.email}`)
            .then(res => res.json())
            .then(data => setAdmin(data.admin))
    }, [user.email])

    const logOut = () => {
        setIsLoading(true)
        signOut(auth)
            .then(() => {
                // Sign-out successful.
            })
            .catch((error) => {
                // An error happened.
            })
            .finally(() => setIsLoading(false))

    }
    const saveUser = (email, displayName, method) => {
        const user = { email, displayName };
        fetch('https://blooming-refuge-00817.herokuapp.com/users/', {
            method: method,
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then()
    }

    return {
        user,
        admin,
        registerUser,
        loginUser,
        logOut,
        isLoading,
        googleLogin
    }
}
export default useFirebase;