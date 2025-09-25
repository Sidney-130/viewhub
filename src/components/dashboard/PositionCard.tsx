interface Props {
  pool: string
  tvl: string
  range: { min: number; max: number }
  fees: string
  outOfRange: boolean
}

export default function PositionCard({ pool, tvl, range, fees, outOfRange }: Props) {
  return (
    <div className="p-4 bg-red-500 rounded shadow">
      <h3 className="font-medium text-lg mb-2">{pool}</h3>
      <p>TVL: ${tvl}</p>
      <p>
        Range: {range.min} — {range.max}
      </p>
      <p>Fees earned: ${fees}</p>
      {outOfRange && <p className="mt-2 text-yellow-600">⚠️ Position is out of range</p>}
    </div>
  )
}
