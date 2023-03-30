import { Grid, GridItem } from "@hope-ui/solid"
import type { Component } from 'solid-js'

const App: Component = () => (
    <Grid templateAreas={`"nav nav" "aside main"`}>
        <GridItem area="nav" bg="papayawhip">Nav</GridItem>
        <GridItem area="aside" bg="tomato">Aside</GridItem>
        <GridItem area="main" bg="papayawhip">Main</GridItem>
    </Grid>
)

export default App
