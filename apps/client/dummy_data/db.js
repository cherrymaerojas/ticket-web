module.exports = () => {
    const data = { events: [] }
    for (let i = 0; i < 100; i++) {
        data.events.push(
            {
                id: 28,
                ref_id: null,
                provider_id: 4,
                name: "Joe Bonamassa",
                url: "https://ticketomaha.com/Productions/joe-bonamassa",
                venue: "Orpheum Theatre - Omaha",
                description: null,
                poster: null,
                skybox_error: "HTTP request returned status cod",
                skybox_status: "ERROR",
                created_at: "2022-06-14T15:06:10.000000Z",
                updated_at: "2023-03-09T20:24:49.000000Z",
                sk_performer_id: 7340,
                sk_po_id: null,
                last_update: "2022-08-05 19:59:00",
                queued: 0,
                priority: -1,
                init_sync: 0,
                venue_id: 1255,
                manual_event: 0,
                skybox_auto_sync: true,
                archived: "2023-03-09 20:24:49",
                num_seats: 375,
                total_seats: 2636,
                upcoming_performance: null,
                valid_performances: 0,
                provider: {
                    id: 4,
                    name: "OMAHA",
                    description: ""
                },
                performer: {
                    id: 7340,
                    name: "Joe Bonamassa",
                    eventType: "CONCERT",
                    created_at: "2022-05-11T00:05:28.000000Z",
                    updated_at: "2023-03-14T04:40:25.000000Z"
                },
                venue_: {
                    id: 1255,
                    name: "Orpheum Theatre - Omaha",
                    address: "409 S. 16th St.",
                    city: "Omaha",
                    country: "US",
                    phone: "402-444-4750",
                    postalCode: "68102",
                    state: "NE",
                    timeZone: "America/Chicago",
                    _data: null,
                    created_at: "2022-05-30T13:16:27.000000Z",
                    updated_at: "2023-02-14T16:08:21.000000Z"
                }
            }
        )
    }
    return data
}
