import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Footer = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>&copy; 2025 Moodify</Text>
            <Text style={styles.text}>We sync your mood with music.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 80,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6
    },
    text: {
        color: '#625834',
        fontSize: 16,
        fontFamily: 'LibreBaskerville-Regular'
    }
})

export default Footer;