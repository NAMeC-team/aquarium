import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect, useState } from "react";
import { CommandData, Vector3 } from "../../types/message";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)


interface VESProps {
  robotId: number
}

interface ErrorData {
  target: number
  chartData: ChartData<"line">
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
      // use xy error sum
      data: [],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(250, 254, 255, 0.5)',
    }]
  }
}

function optionsWithTitle(text: string): ChartOptions {
  return {
    responsive: true,
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
  function updateChartData(cmdError: Vector3) {
    allChartsData.xErrors.chartData.datasets[0].data.push(cmdError[0])
    allChartsData.yErrors.chartData.datasets[0].data.push(cmdError[1])
    allChartsData.zErrors.chartData.datasets[0].data.push(cmdError[2])
  }
  function updateTimestampLabels(cmdTimeMs: number) {
    allChartsData.xErrors.chartData.labels?.push(cmdTimeMs)
    allChartsData.yErrors.chartData.labels?.push(cmdTimeMs)
    allChartsData.zErrors.chartData.labels?.push(cmdTimeMs)
  }
  function targetChanged(newTarget: Vector3) {
    return allChartsData.xErrors.target !== newTarget[0]
      || allChartsData.yErrors.target !== newTarget[1]
      || allChartsData.zErrors.target !== newTarget[2]
  }
  function clearCharts(cmdData: CommandData) {
    allChartsData.xErrors.target = cmdData.target[0]
    allChartsData.yErrors.target = cmdData.target[1]
    allChartsData.zErrors.target = cmdData.target[2]

    if (allChartsData.xErrors.chartData.labels) allChartsData.xErrors.chartData.labels.length = 0
    allChartsData.xErrors.chartData.datasets[0].data.length = 0
    if (allChartsData.yErrors.chartData.labels) allChartsData.yErrors.chartData.labels.length = 0
    allChartsData.yErrors.chartData.datasets[0].data.length = 0
    if (allChartsData.zErrors.chartData.labels) allChartsData.zErrors.chartData.labels.length = 0
    allChartsData.zErrors.chartData.datasets[0].data.length = 0
  }

  let [allChartsData, setAllChartsData] = useState<AllErrorCharts>({
    xErrors: {target: 0., chartData: emptyData()},
    yErrors: {target: 0., chartData: emptyData()},
    zErrors: {target: 0., chartData: emptyData()}
  })
  let cmdData = useSelector((state: RootState) => state.crabe.commandData[robotId])


  useEffect(() => {
    if (!cmdData) return
    if (targetChanged(cmdData.target)) {
      clearCharts(cmdData)
    } else {
      updateChartData(cmdData.cmdError)
      updateTimestampLabels(cmdData.cmdTimeMs)
    }
    setAllChartsData(allChartsData)
  }, [cmdData])

  return <>
    <Line data={allChartsData.xErrors.chartData} options={optionsWithTitle("X error")} />
    {/*<Line data={allChartsData.yErrors.chartData} options={optionsWithTitle("Y error")} />*/}
    {/*<Line data={allChartsData.zErrors.chartData} options={optionsWithTitle("Z error")} />*/}
  </>
}