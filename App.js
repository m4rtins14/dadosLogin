/*import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, Platform, StatusBar, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [usuario, setUsuario] = useState(null);
    const [entrada, setEntrada] = useState('');

    return (
        <ImageBackground source={require('./assets/bground.png')} style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
            />
            <TouchableOpacity style={styles.botao} onPress={() => {}}>
                <MaterialIcons name="person-add" size={24} color="white" />
                <Text style={styles.botaoTexto}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botao} onPress={() => {}}>
                <MaterialIcons name="login" size={24} color="white" />
                <Text style={styles.botaoTexto}>Entrar</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
    },
    input: {
        width: '100%',
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 2,
    },
    botao: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        elevation: 3,
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});*/

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, firestore } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function EnviarMensagem() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [usuario, setUsuario] = useState(null);
    const [entrada, setEntrada] = useState('');

    useEffect(() => {
        const atualizaUsuario = onAuthStateChanged(auth, (usuario) => {
            setUsuario(usuario);
        });

        return () => atualizaUsuario();
    }, []);

    const cadastrar = () => {
        createUserWithEmailAndPassword(auth, email, senha)
            .then(userCredential => {
                setUsuario(userCredential.user);
                setEmail('');
                setSenha('');
            })
            .catch(error => alert(error.message));
    };

    const entrar = () => {
        signInWithEmailAndPassword(auth, email, senha)
            .then(userCredential => {
                setUsuario(userCredential.user);
                setEmail('');
                setSenha('');
            })
            .catch(error => alert(error.message));
    };

    const sair = () => {
        signOut(auth)
            .then(() => setUsuario(null))
            .catch(error => alert(error.message));
    };

    const enviarMensagem = async () => {
        if (entrada && usuario) {
            try {
                await addDoc(collection(firestore, 'messages'), {
                    text: entrada,
                    createdAt: serverTimestamp(),
                    uid: usuario.uid
                });
                setEntrada('');
            } catch (error) {
                console.error("Erro ao adicionar mensagem: ", error);
            }
        }
    };

    return (
        <ImageBackground source={require('./assets/bground.png')} style={styles.container}>
            <StatusBar barStyle="dark-content" />
            {usuario ? (
                <>
                    <Text style={styles.welcomeText}>Bem-vindo, {usuario.email}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite uma mensagem"
                        value={entrada}
                        onChangeText={setEntrada}
                    />
                    <TouchableOpacity style={styles.botao} onPress={enviarMensagem}>
                        <MaterialIcons name="send" size={24} color="white" />
                        <Text style={styles.botaoTexto}>Enviar Mensagem</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botaoSair} onPress={sair}>
                        <MaterialIcons name="logout" size={24} color="white" />
                        <Text style={styles.botaoTexto}>Sair</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.botao} onPress={cadastrar}>
                        <MaterialIcons name="person-add" size={24} color="white" />
                        <Text style={styles.botaoTexto}>Cadastrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botao} onPress={entrar}>
                        <MaterialIcons name="login" size={24} color="white" />
                        <Text style={styles.botaoTexto}>Entrar</Text>
                    </TouchableOpacity>
                </>
            )}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
       // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        elevation: 4,
    },
    input: {
        fontSize: 20,
        width: '100%',
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 2,
    },
    botao: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        elevation: 3,
    },
    botaoSair: {
        backgroundColor: '#f44336',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        elevation: 3,
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

