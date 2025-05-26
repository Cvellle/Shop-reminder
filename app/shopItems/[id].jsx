import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native'

import { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { countState } from "@/store/store";
import { useRecoilState } from "recoil";


export default function EditScreen() {
    const { id } = useLocalSearchParams()
    const [shopItems, setShopItems] = useRecoilState(countState);
    const [shopItem, setShopItem] = useState({})
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)
    const router = useRouter()

    const [loaded, error] = useFonts({
        Inter_500Medium,
    })

    useEffect(() => {

        const fetchData = async (id) => {
            try {
                const jsonValue = await AsyncStorage.getItem("ShopItemApp")
                const storageShopItems = jsonValue != null ? JSON.parse(jsonValue) : null

                if (storageShopItems && storageShopItems.length) {
                    const myShopItem = shopItems.find(shopItem => shopItem.id.toString() === id)
                    setShopItem(myShopItem)
                }
            } catch (e) {
                console.error(e)
            }
        }

        fetchData(id)
    }, [id])

    if (!loaded && !error) {
        return null
    }

    const styles = createStyles(theme, colorScheme)

    const handleSave = async () => {
        try {
            const savedShopItem = { ...shopItem, title: shopItem.title }

            const jsonValue = await AsyncStorage.getItem('ShopItemApp')
            const storageShopItems = jsonValue != null ? JSON.parse(jsonValue) : null

            if (storageShopItems && storageShopItems.length) {
                const otherShopItems = storageShopItems.filter(shopItem => shopItem.id !== savedShopItem.id)
                const allShopItems = [...otherShopItems, savedShopItem]
                setShopItems([...otherShopItems, savedShopItem])
                await AsyncStorage.setItem('ShopItemApp', JSON.stringify(allShopItems))
            } else {
                await AsyncStorage.setItem('ShopItemApp', JSON.stringify([savedShopItem]))
            }

            router.push('/')
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {JSON.stringify(shopItems)}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    maxLength={30}
                    placeholder="Edit shopItem"
                    placeholderTextColor="gray"
                    value={shopItem?.title || ''}
                    onChangeText={(text) => setShopItem(prev => ({ ...prev, title: text }))}
                />
                <Pressable
                    onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')} style={{ marginLeft: 10 }}>

                    <Octicons name={colorScheme === 'dark' ? "moon" : "sun"} size={36} color={theme.text} selectable={undefined} style={{ width: 36 }} />

                </Pressable>
            </View>
            <View style={styles.inputContainer}>
                <Pressable
                    onPress={handleSave}
                    style={styles.saveButton}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push('/')}
                    style={[styles.saveButton, { backgroundColor: 'red' }]}
                >
                    <Text style={[styles.saveButtonText, { color: 'white' }]}>Cancel</Text>
                </Pressable>
            </View>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaView>
    )
}

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            backgroundColor: theme.background,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            gap: 6,
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
        saveButton: {
            backgroundColor: theme.button,
            borderRadius: 5,
            padding: 10,
        },
        saveButtonText: {
            fontSize: 18,
            color: colorScheme === 'dark' ? 'black' : 'white',
        }
    })
}