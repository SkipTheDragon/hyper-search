import {
    Box,
    FormLabel,
    Input,
    Switch,
    Text,
    useColorModeValue,
    chakra,
    FormControl,
    useColorMode, usePrefersReducedMotion, Button, FormHelperText
} from "@chakra-ui/react";
import {useSettingsStore} from "../../stores/settingsStore";
import {useEffect, useState} from "react";
import {useReducedMotion} from "framer-motion";

export default function () {
    const bgColor = useColorModeValue('gray.50', 'navy.700');
    const {colorMode, toggleColorMode} = useColorMode();
    const {states, actions} = useSettingsStore();
    const hasReducedMotion = usePrefersReducedMotion();
    const [isPinned, toggleSettingsPanel] = useState(false);

    useEffect(() => {
        if (states.synced) return;
        actions.setReducedMotion(hasReducedMotion);
        actions.setSynced();
    }, []);

    return (
        <Box
            backgroundColor={bgColor}
            shadow='md'
            position="fixed"
            top={"30vh"}
            maxWidth={"300px"}
            right={isPinned ? 0 : '-260px'}
            transition="right 0.3s ease-in-out"
            _hover={{
                right: '0'
            }}
            padding={"1rem"}
            dropShadow={"0px 1px 2px 0px gray.50"}
            borderRadius="md"
        >
            <chakra.h2 fontWeight={'bold'} fontSize={'1.1rem'}>Settings Panel</chakra.h2>
            <Text color={'gray.500'}>Settings for demo/testing purposes.</Text>

            <FormControl marginTop={'20px'} display="flex">
                <Switch isChecked={isPinned} onChange={() => toggleSettingsPanel(!isPinned)} id="theme-switcher"/>
                <FormLabel marginLeft={'10px'} htmlFor="theme-switcher">Pin Settings Panel</FormLabel>
            </FormControl>


            <FormControl marginTop={'20px'} display="flex">
                <Switch isChecked={colorMode === 'dark'} onChange={() => toggleColorMode()} id="theme-switcher"/>
                <FormLabel marginLeft={'10px'} htmlFor="theme-switcher">Toggle Dark Mode</FormLabel>
            </FormControl>

            <FormControl marginTop={'20px'} display="flex">
                <Switch isChecked={states.reducedMotion}
                        onChange={() => {
                            actions.setReducedMotion(!states.reducedMotion)
                        }} id="reduced-motion-switcher"/>
                <FormLabel marginLeft={'10px'} htmlFor="reduced-motion-switcher">Toggle reduced motion</FormLabel>
            </FormControl>

            <FormControl marginTop={'20px'} display="flex">
                <Switch isChecked={states.fillHistory}
                        onChange={() => {
                            actions.setFillHistory(!states.fillHistory)
                        }} id="fill-history-data"/>
                <FormLabel marginLeft={'10px'} htmlFor="fill-history-data">Fill search history with demo data.</FormLabel>
            </FormControl>

            <FormControl marginTop={'20px'}>
                <FormLabel htmlFor="animation-delay">Animation Delay</FormLabel>
                <Input type="number" id="animation-delay"
                       value={states.animationDelay}
                       onChange={(e) => actions.setAnimationDelay(parseInt(e.target.value))}
                       placeholder="Delay in ms..."/>
                <Text fontSize="0.9rem" marginTop="10px" color={'gray.500'}>Search is artificially delayed 5000ms
                     for demo purposes.</Text>
            </FormControl>

            <Button marginTop={'20px'} onClick={() => {window.location.reload()}} colorScheme={'blue'}>Reset app</Button>
        </Box>
    )
}
