import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  createDisclosure,
  notificationService,
} from "@hope-ui/solid"
import { For, Match, Switch, createEffect, createSignal } from "solid-js"

import axios from "axios"
import { createMutation } from "@tanstack/solid-query"
import { useParams } from "@solidjs/router"
import SkeletonLoader from "../../../components/SkeletonLoader"
import { FiExternalLink } from "solid-icons/fi"
import CircleIcon from "../../../components/CircleIcon"
import { AiOutlineDelete } from "solid-icons/ai"
import { VsAdd } from "solid-icons/vs"

export interface Root {
  id: number
  ref_id: any
  provider_id: number
  name: string
  url: string
  venue: string
  description: any
  poster: any
  skybox_error: string
  skybox_status: string
  created_at: string
  updated_at: string
  sk_performer_id: number
  sk_po_id: any
  last_update: string
  queued: number
  priority: number
  init_sync: number
  venue_id: number
  manual_event: number
  skybox_auto_sync: boolean
  archived: string
  num_seats: number
  total_seats: number
  upcoming_performance: any
  valid_performances: number
  provider: Provider
  performer: Performer
  venue_: Venue
}

export interface Provider {
  id: number
  name: string
  description: string
}

export interface Performer {
  id: number
  name: string
  eventType: string
  created_at: string
  updated_at: string
}

export interface Venue {
  id: number
  name: string
  address: string
  city: string
  country: string
  phone: string
  postalCode: string
  state: string
  timeZone: string
  _data: any
  created_at: string
  updated_at: string
}

const tableHeaders: string[] = [
  "Section",
  "Row",
  "Seat Number",
  "Quantity",
  "Price",
  "List Price",
  "Status",
  "Skybox",
  "Action",
]

function fetchPerformanceWithSeats(performanceId: string) {
  return async function () {
    const results = await Promise.all([
      fetchPerformance(performanceId),
      fetchPerformanceSeats(performanceId),
    ])
    return results
  }
}

function fetchPerformance(performanceId: string) {
  return axios
    .get(`http://srv430760.hstgr.cloud/api/events/performance/${performanceId}`)
    .then(res => res.data)
}

function fetchPerformanceSeats(performanceId: string) {
  return axios
    .get(
      `http://srv430760.hstgr.cloud/api/events/performance/${performanceId}/inventory`
    )
    .then(res => res.data)
}

export default function PerformanceItem() {
  const param = useParams()
  const { isOpen, onOpen, onClose } = createDisclosure()
  const [selectedSeat, setSelectedSeat] = createSignal({
    section: "",
    row: "",
    low: "",
    high: "",
  })
  const results = createMutation({
    mutationFn: fetchPerformanceWithSeats(param.id),
    onError() {
      notificationService.show({
        status: "danger",
        description: "Failed to fetch data",
      })
    },
  })

  createEffect(() => {
    results.mutateAsync()
  })

  return (
    <>
      <Switch>
        <Match when={results.isLoading}>
          <SkeletonLoader />
        </Match>
        <Match when={results.isSuccess}>
          <Box overflow="scroll">
            <Table striped="odd">
              <TableCaption placement="top">
                <Text color="blue" as="u">
                  <a href={results.data?.[0].event.url} target="_blank">
                    {results.data?.[0].name}
                  </a>
                </Text>{" "}
                {results.data?.[0].date}
              </TableCaption>
              <Thead>
                <Tr>
                  <For each={tableHeaders}>{header => <Th>{header}</Th>}</For>
                </Tr>
              </Thead>
              <Tbody>
                <For each={results.data?.[1]}>
                  {seat => (
                    <Tr>
                      <Td>{seat.section}</Td>
                      <Td>{seat.row}</Td>
                      <Td>{seat.seatNumbers}</Td>
                      <Td>{seat.quantity}</Td>
                      <Td></Td>
                      <Td>{seat.listPrice}</Td>
                      <Td>
                        <Switch>
                          <Match when={seat.broadcast === true}>
                            <Tooltip label="Broadcasted">
                              <CircleIcon boxSize="$3" color="green" />
                            </Tooltip>
                          </Match>
                          <Match when={seat.broadcast === false}>
                            <Tooltip label="Not Broadcasted">
                              <CircleIcon boxSize="$3" color="red" />
                            </Tooltip>
                          </Match>
                        </Switch>
                      </Td>
                      <Td color="blue">
                        <a
                          href={`https://skybox.vividseats.com/inventory?groupBy=event&limit=100&pageNumber=1&sortedByB=section&sortDirB=desc&ef.excludeParking=false&ef.eventDate=fromToday&ef.tagsMatchAll=false&inf.eventId=${param.id}&forceCollapse=true`}
                          target="_blank"
                        >
                          <FiExternalLink />
                        </a>
                      </Td>
                      <Td>
                        <IconButton
                          colorScheme="primary"
                          aria-label="Add"
                          icon={<VsAdd />}
                          onClick={e => {
                            setSelectedSeat(prev => ({
                              section: seat.section,
                              row: seat.row,
                              low: seat.lowSeat,
                              high: seat.highSeat,
                            }))
                            onOpen()
                          }}
                        />
                      </Td>
                    </Tr>
                  )}
                </For>
              </Tbody>
            </Table>
          </Box>
        </Match>
        <Match when={results.isError}>Error</Match>
      </Switch>
      <Modal centered opened={isOpen()} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="$container2xl">
          <ModalCloseButton />
          <ModalHeader>Add seats: 1 packs</ModalHeader>
          <form>
            <ModalBody>
              <Table striped="odd">
                <Thead>
                  <Tr>
                    <Th>Section</Th>
                    <Th>Row</Th>
                    <Th>Low #</Th>
                    <Th>High #</Th>
                    <Th>Qty</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>{selectedSeat().section}</Td>
                    <Td>{selectedSeat().row}</Td>
                    <Td>
                      <FormControl id="lowNumber" mb="$4">
                        <Input
                          type="text"
                          disabled
                          value={selectedSeat().low}
                        />
                      </FormControl>
                    </Td>
                    <Td>
                      <FormControl id="highNumber" mb="$4">
                        <Input
                          type="text"
                          disabled
                          value={selectedSeat().high}
                        />
                      </FormControl>
                    </Td>
                    <Td>
                      <FormControl id="currentPassword" mb="$4">
                        <Input
                          type="number"
                          min={selectedSeat().low}
                          max={selectedSeat().high}
                          required
                        />
                      </FormControl>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button type="submit">OK</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
