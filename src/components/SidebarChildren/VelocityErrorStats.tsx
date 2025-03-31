import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect, useState } from "react";
import { Vector3 } from "../../types/message";
import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions, Legend,
  LinearScale,
  LineElement,
  PointElement, Title, Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useAppSelector } from "../../app/hooks";
import { AllyInfo, Robot } from "../../types/world";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)


interface VESProps {
  robotId: number
}

interface ErrorData {
  target: number
  chartData: ChartData<"line">
  startTime: number
}

interface AllErrorCharts {
  xErrors: ErrorData
  yErrors: ErrorData
  zErrors: ErrorData
}

/**
 * Returns empty chart data, used for initialization
 */
function emptyData(): ChartData<"line"> {
  return {
    labels: [],
    datasets: [{
      label: "measured",
      data: [], // actual data
      pointRadius: 0,
      borderWidth: 1,
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(250, 254, 255, 0.5)',
    },
    {
      label: "target",
      data: [], // target line
      pointRadius: 0,
      borderWidth: 1,
      borderColor: 'rgb(255,0,0)',
      backgroundColor: 'rgba(250, 254, 255, 0.5)',
    }]
  }
}

/**
 * Options used for each chart
 * @param text Title of the chart, set at the top of it
 */
function optionsWithTitle(text: string): ChartOptions {
  return {
    animation: false,
    responsive: true,
    backgroundColor: "rgb(255,255,255)",
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: text ?? "",
      },
    },
  }
}

export default function VelocityErrorStats({ robotId }: VESProps) {
  function updateChartData(ally: Robot<AllyInfo>) {
    let cmdError = [
      allChartsData.xErrors.target - ally.pose.position[0],
      allChartsData.yErrors.target - ally.pose.position[1],
      allChartsData.zErrors.target - ally.pose.orientation
    ]

    allChartsData.xErrors.chartData.datasets[0].data.push(cmdError[0])
    allChartsData.yErrors.chartData.datasets[0].data.push(cmdError[1])
    allChartsData.zErrors.chartData.datasets[0].data.push(cmdError[2])

    allChartsData.xErrors.chartData.datasets[1].data.push(0.)
    allChartsData.yErrors.chartData.datasets[1].data.push(0.)
    allChartsData.zErrors.chartData.datasets[1].data.push(0.)
  }
  function updateTimestampLabels(cmdTimeMs: number) {
    allChartsData.xErrors.chartData.labels?.push((cmdTimeMs - allChartsData.xErrors.startTime) / 1000.)
    allChartsData.yErrors.chartData.labels?.push((cmdTimeMs - allChartsData.yErrors.startTime) / 1000.)
    allChartsData.zErrors.chartData.labels?.push((cmdTimeMs - allChartsData.zErrors.startTime) / 1000.)
  }
  function targetChanged(newTarget: Vector3) {
    return allChartsData.xErrors.target !== newTarget[0]
      || allChartsData.yErrors.target !== newTarget[1]
      || allChartsData.zErrors.target !== newTarget[2]
  }
  function resetCharts(newTarget: Vector3) {
    allChartsData.xErrors.target = newTarget[0]
    allChartsData.yErrors.target = newTarget[1]
    allChartsData.zErrors.target = newTarget[2]

    allChartsData.xErrors.startTime = Date.now()
    allChartsData.yErrors.startTime = Date.now()
    allChartsData.zErrors.startTime = Date.now()

    if (allChartsData.xErrors.chartData.labels) allChartsData.xErrors.chartData.labels.length = 0
    allChartsData.xErrors.chartData.datasets[0].data.length = 0
    allChartsData.xErrors.chartData.datasets[1].data.length = 0
    if (allChartsData.yErrors.chartData.labels) allChartsData.yErrors.chartData.labels.length = 0
    allChartsData.yErrors.chartData.datasets[0].data.length = 0
    allChartsData.yErrors.chartData.datasets[1].data.length = 0
    if (allChartsData.zErrors.chartData.labels) allChartsData.zErrors.chartData.labels.length = 0
    allChartsData.zErrors.chartData.datasets[0].data.length = 0
    allChartsData.zErrors.chartData.datasets[1].data.length = 0
  }

  let [allChartsData, setAllChartsData] = useState<AllErrorCharts>({
    xErrors: {target: 0., chartData: emptyData(), startTime: Date.now()},
    yErrors: {target: 0., chartData: emptyData(), startTime: Date.now()},
    zErrors: {target: 0., chartData: emptyData(), startTime: Date.now()}
  })
  let cmdTarget = useSelector((state: RootState) => state.crabe.commandTargets[robotId])
  let world = useSelector((state: RootState) => state.crabe.world)

  useEffect(() => {
    if (!cmdTarget) return
    if (targetChanged(cmdTarget)) {
      resetCharts(cmdTarget)
      console.log(cmdTarget)
    }
    let ally = world.alliesBot[robotId]
    if (ally) {
      updateChartData(ally)
      updateTimestampLabels(Date.now())
    }
    setAllChartsData(allChartsData)
  }, [cmdTarget])

  return <>
    <Line data={allChartsData.xErrors.chartData} options={optionsWithTitle("X error")} />
    {/*<Line data={allChartsData.yErrors.chartData} options={optionsWithTitle("Y error")} />*/}
    {/*<Line data={allChartsData.zErrors.chartData} options={optionsWithTitle("Z error")} />*/}
  </>
}