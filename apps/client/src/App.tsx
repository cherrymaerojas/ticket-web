import { Grid, GridItem } from "@hope-ui/solid"
import type { Component } from 'solid-js'
import NavBar from "./components/Navbar"

const App: Component = () => (
    <Grid templateAreas={`"nav nav" "aside main"`}>
        <GridItem area="nav">
            <NavBar />
        </GridItem>
        <GridItem area="aside" bg="tomato">Aside</GridItem>
        <GridItem area="main" bg="papayawhip">Main</GridItem>
    </Grid>
)

export default App
