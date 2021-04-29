import { useContext } from 'react'
import NowContext from '../../../contexts/now'
import useColor from '../../../hooks/useColor'
import useKeepInView from '../../../hooks/useKeepInView'
import { SlotModel } from '../../../hooks/useSchedule'
import useSlotTimeLabel from '../../../hooks/useSlotTimeLabel'
import makeProgressPositionStyle from '../../../utils/makeProgressPositionStyle'
import Block from '../../Block/Block'
import Hand from '../../Hand/Hand'

interface Props {
  slot: SlotModel
}

export default function Slot({ slot }: Props) {
  const color = (
    useColor(slot.title + slot.starts.toString())
  )

  const slotStartTime = (
    useSlotTimeLabel(slot.starts)
  )

  const now = useContext(
    NowContext,
  )

  const nowIndicatorHand = (
    useKeepInView()
  )

  let nowStyle: any = {
    display: 'none',
  }

  let blockContainerStyle: any = {
    alignItems: 'center',
  }

  if (now >= slot.starts && now < slot.ends) {
    const fraction = (
      (now - slot.starts) / (slot.ends - slot.starts)
    )

    nowStyle = makeProgressPositionStyle(
      fraction,
    )

    // To prevent the information hand and the indicator hand overlaying
    // on top of each other, move the information hand away to the top
    // to make space for the indicator.
    if (fraction >= 0.4 && fraction <= 0.7) {
      blockContainerStyle = {
        alignItems: 'start',
      }
    }

    nowIndicatorHand.bringIntoView()
  }

  return (
    <div className="my-2 relative z-10">
      <div style={blockContainerStyle} className="flex">
        <Block text={slotStartTime} units={slot.duration} color={color} />
        <Hand text={slot.title} handColor="gray-300" />
      </div>

      <div style={nowStyle} className="absolute w-full -z-10" ref={nowIndicatorHand.ref}>
        <Hand text="Now" handColor={color} textColor={color} />
      </div>
    </div>
  )
}
