import { Text, View, TextInput, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Animated, { LinearTransition } from 'react-native-reanimated'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

import { data } from "@/data/shopItems"
import { useRecoilState } from "recoil";
import { countState } from "@/store/store";

export default function Index() {
  const [shopItems, setShopItems] = useRecoilState(countState);
  const [text, setText] = useState('')
  const { colorScheme, theme } = useContext(ThemeContext)
  const router = useRouter()

  const [loaded, error] = useFonts({
    Inter_500Medium,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("ShopItemApp")
        const storageShopItems = jsonValue != null ? JSON.parse(jsonValue) : null

        if (storageShopItems && storageShopItems.length) {
          setShopItems(storageShopItems.sort((a, b) => b.id - a.id))
        } else {
          setShopItems(data.sort((a, b) => b.id - a.id))
        }
      } catch (e) {
        console.error(e)
      }
    }

    fetchData()
  }, [data])

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(shopItems)
        await AsyncStorage.setItem("ShopItemApp", jsonValue)
      } catch (e) {
        console.error(e)
      }
    }

    storeData()
  }, [shopItems])

  if (!loaded && !error) {
    return null
  }

  const styles = createStyles(theme, colorScheme)

  const addShopItem = () => {
    if (text.trim()) {
      const newId = shopItems.length > 0 ? shopItems[0].id + 1 : 1;
      setShopItems([{ id: newId, title: text, completed: false }, ...shopItems])
      setText('')
    }
  }

  const toggleShopItem = (id) => {
    setShopItems(shopItems.map(shopItem => shopItem.id === id ? { ...shopItem, completed: !shopItem.completed } : shopItem))
  }

  const removeShopItem = (id) => {
    setShopItems(shopItems.filter(shopItem => shopItem.id !== id))
  }

  const handlePress = (id) => {
    router.push(`/shopItems/${id}`)
  }

  const renderItem = ({ item }) => (
    <View style={styles.shopItemItem}>
      <Pressable
        onPress={() => handlePress(item.id)}
        onLongPress={() => toggleShopItem(item.id)}
      >
        <Text
          style={[styles.shopItemText, item.completed && styles.completedText]}
        >
          {item.title}
        </Text>
      </Pressable>
      <Pressable onPress={() => removeShopItem(item.id)}>
        <MaterialCommunityIcons name="delete-circle" size={36} color="red" selectable={undefined} />
      </Pressable>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          maxLength={30}
          placeholder="Add a new item for shopping"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addShopItem} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>
      <Animated.FlatList
        data={shopItems}
        renderItem={renderItem}
        keyExtractor={shopItem => shopItem.id}
        contentContainerStyle={{ flexGrow: 1 }}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
      />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      padding: 10,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    input: {
      flex: 1,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      minWidth: 0,
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    addButtonText: {
      fontSize: 18,
      color: colorScheme === 'dark' ? 'black' : 'white',
    },
    shopItemItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      padding: 10,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    shopItemText: {
      flex: 1,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: 'gray',
    }
  })
}