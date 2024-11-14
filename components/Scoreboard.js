import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import { SCOREBOARD_KEY } from '../constants/Game';
import styles from '../style/style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native';

export default Scoreboard = ({ navigation }) => {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getScoreboardData();
        });
        return unsubscribe;
    }, [navigation]);

    const getScoreboardData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (jsonValue !== null) {
                const tmpScores = JSON.parse(jsonValue);
                // Lajittele pisteet tässä, jos tarvitsee
               
                setScores(tmpScores.slice(0, 3));
                console.log('Scoreboard: Read successful.');
                console.log('Scoreboard: Number of scores: ' + tmpScores.length);
            }
        } catch (e) {
            console.log('Scoreboard: Read error:' + e);
        }
    };

    const clearScoreboard = async () => {
        try {
            await AsyncStorage.removeItem(SCOREBOARD_KEY);
            setScores([]);
        } catch (e) {
            console.log('Scoreboard: Clear error' + e);
        }
    };

    return (
        <>
          <Header />
            <View style={styles.container}>
                <Text style={styles.title}>Scoreboard</Text>
                    {scores.length === 0 ? (
                        <Text>No scores available.</Text>
                    ) : (
                        scores.map((score, index) => (
                            <View key={index} style={styles.scoreItem}>
                                <Text>{score.name}: {score.points} points</Text>
                                <Text>{score.date} at {score.time}</Text>
                            </View>
                        ))
                    )}
                <Button title="Clear Scoreboard" onPress={clearScoreboard} />
            </View>
            <Footer />
        </>
    );
};

