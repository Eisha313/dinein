import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
export default function CustomActivityIndicator({size = 'medium'}) {
    const {colors} = useTheme()
    const [val, setVal] = useState(Math.round(Math.random()))
    useEffect(() => {
        const interval = setInterval(() => {
            setVal(Math.round(Math.random()))
        }, 500)
        return () => {
            clearInterval(interval)
        }
    }, [])
    return (
        <ActivityIndicator animating={true} 
        color={val === 0 ? colors.primaryBackground : colors.secondaryBackground} size={size}
        style={{padding: 8, opacity: 0.8}} />
    )
}