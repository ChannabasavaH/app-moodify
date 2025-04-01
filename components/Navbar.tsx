import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Moodify</Text>
      
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => setMenuOpen(!menuOpen)}
      >
        <Icon name='bars' color='#fff' size={30} />
      </TouchableOpacity>

      {menuOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => console.log('Navigate to Sign Up')}
          >
            <Text style={styles.menuText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => console.log('Navigate to Login')}
          >
            <Text style={styles.menuText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'relative',
    zIndex:100,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    paddingTop: 8,
  },
  menuButton: {
    padding: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 10,
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Navbar;