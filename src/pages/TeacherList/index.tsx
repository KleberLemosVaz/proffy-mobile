import React, { useState } from 'react'
import { View, ScrollView, Text, AsyncStorage } from 'react-native'

import styles from './styles'
import PageHeader from '../../components/PageHeader'
import TeacherItem, { Teacher } from '../../components/TeacherItem'
import { TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler'

import { Feather } from '@expo/vector-icons'
import api from '../../services/api'
import { useFocusEffect } from '@react-navigation/native'


function TeacherList() {
    const [teachers,setTeachers] = useState([])
    const [favorites,setFavorites] = useState<number[]>([])
    const [isFilterVisible, setIsFilterVisible] = useState(false)

    const [subject,setSubject] = useState('')
    const [week_day,setWeek_day] = useState('')
    const [time,setTime] = useState('')

    function loadFavorites(){
        AsyncStorage.getItem('favorites').then(res => {
            if(res){
                const favoritedTeachers = JSON.parse(res)
                const favoritedTeachersIds = favoritedTeachers.map((teacher:Teacher) => {
                    return teacher.id;
                })

                setFavorites(favoritedTeachersIds)
            }
        })
    }

    useFocusEffect(()=>{
        loadFavorites()
    })

    function handleToggleFiltersVisible() {
        setIsFilterVisible(!isFilterVisible)
    }
    
    async function handleFiltersSubmit(){
        loadFavorites()

        const response = await api.get('classes',{
            params: {
                subject,
                week_day,
                time
            }
        })

        
        setIsFilterVisible(false)
        setTeachers(response.data)
    }
    return (
        <View style={styles.container}>
            <PageHeader 
                title="Proffys disponíveis" 
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name="filter" size={20} color="#FFF"/>
                    </BorderlessButton>
                )}
            >
                {isFilterVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput
                            placeholderTextColor="c1bccc"
                            value={subject}
                            onChangeText={text => setSubject(text)}
                            style={styles.input}
                            placeholder='Qual a matéria'
                        />


                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput
                                    placeholderTextColor="c1bccc"
                                    value={week_day}
                                    onChangeText={text => setWeek_day(text)}
                                    style={styles.input}
                                    placeholder='Qual o dia?'
                                />
                            </View>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput
                                    placeholderTextColor="c1bccc"
                                    value={time}
                                    onChangeText={text => setTime(text)}
                                    style={styles.input}
                                    placeholder='Qual o horário?'
                                />
                            </View>
                        </View>
                        <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonTex}>Filtrar</Text>
                        </RectButton>
                    </View>
                )}

            </PageHeader>
            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 24
                }}
            >
                {teachers.map((teacher : Teacher) => {
                return <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                        />
                })}
                
            </ScrollView>
        </View>)
}

export default TeacherList