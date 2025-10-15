import { Transaction } from './transaction_row';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  TooltipProps
} from 'recharts';
import { Card } from './ui/card';
import { formatCurrency } from '@/utils/formatCurrency';


interface PredictionData {
    data_size?: number, 
    predict_x_epoch?: number,
    predict_y_net_saving?: number,
    warning?: string,
    regression: {
        slope: number,
        intercept: number
    }
    error?: string;

}

// format date as M/D/YY
function formatDateLabel(tick: number) {
  const dateObj = new Date(tick);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const year = String(dateObj.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}

interface ChartPoint {
    date: number;
    total: number;
    dataType: "Historical" | "Prediction";
}

interface LineRowProps {
  transactions: Transaction[];
  prediction: PredictionData | null;
}

// show details when hovering over graph points
const CustomTooltip = ({
    active,
    payload,
    label,
    predictionData
}: TooltipProps<any, any> & {predictionData: PredictionData | null}) => {
    // only render tootltip if it's active and has valid data
    if (active && payload && payload.length) {
        // extract data point info and determine if it's a prediction
        const point = payload[0]?.payload as ChartPoint;
        const value = payload[0]?.value;
        const isPredictionPoint = point?.dataType === "Prediction";

        // dynamically pick title
        let title;
        if (isPredictionPoint) {
            title = "Predicted Net Saving";
        } else {
            title = "Cumulative Net Saving (Historical)";
        }

        // extract prediction metadata (warning, regression, data size)
        let details = null;
        if (predictionData) {
            details = {
                warning: predictionData.warning,
                regression: predictionData.regression,
                data_size: predictionData.data_size
            }
        }

        return (
            <Card>
                {/* Display title, date, and value */}
                <p className='text-lg font-bold'>{title}</p>
                <p className='text-gray-700'>Date: {formatDateLabel(label as number)}</p>
                <p className='font-bold text-blue-700'>Value: {formatCurrency(value as number)}</p>

                {/* prediction detail section */}
                {isPredictionPoint && details && (
                    <div className='text-center'>
                        <p className='text-lg font-bold text-green-700'>Prediction Details:</p>

                         {/* display warning if present */}
                        {details.warning && (
                            <p className='text-sm text-yellow-600'> Warning: {details.warning} </p>
                        )}

                        {/* display data size used for prediction */}
                        <p>Data Size Used: {details.data_size} </p>

                        {/* display regression coefficients */}
                        {details.regression && (
                            <>
                                <p>Regression Slope: {details.regression.slope.toExponential(4)}</p>
                                <p>Regression Intercept: {formatCurrency(details.regression.intercept)}</p>
                            </>

                        )}

                        <p className='italic mt-1'>This prediction is based on linear regression</p>

                    </div>

                )}


            </Card>

        )


    }

    return null;
}

export function LineRow({ transactions, prediction }: LineRowProps) {
    // filter transactions to only include the last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentTransactions = transactions.filter(
    (t) => new Date(t.created_at) >= thirtyDaysAgo
    );

    // sort transactions oldest to newest
    const sortedTransactions = [...recentTransactions].sort(
    (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // compute running total (adds for sources, subtracts for sinks)
    let runningTotal = 0;
    const historicalChartData: ChartPoint[] = sortedTransactions.map((t) => {
    const amount = Number(t.amount);
    runningTotal += t.EconomyType === 'Source' ? amount : -amount;
    return {
        date: new Date(t.created_at).getTime(),
        total: runningTotal,
        dataType: "Historical"
    };
    });

    if (historicalChartData.length === 0) {
        return (
            <Card>
                <div>
                    <p className='text-center pt-6 text-gray-500'>No transaction found</p>
                </div>
            </Card>
        );
    }

    // Create a single combined dataset for axis scaling
    let combinedData: ChartPoint[] = [...historicalChartData];
    let predictionSegmentData: ChartPoint[] = [];

    const lastHistoricalPoint = historicalChartData[historicalChartData.length - 1];

    // valid prediction data
    if (prediction && prediction.predict_x_epoch && prediction.predict_y_net_saving) {
        // create prediction point once
        const predictionPoint: ChartPoint = {
            date: prediction.predict_x_epoch,
            total: prediction.predict_y_net_saving,
            dataType: "Prediction" 
        };

        // use it both places
        combinedData.push(predictionPoint);
        predictionSegmentData = [lastHistoricalPoint, predictionPoint];

    }


  return (
    <div className="grid m-2">
      <Card className="flex flex-col col-span-2 p-12 h-120">
        <div className="flex-1 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
                data={combinedData}
                margin={{left: 60, bottom: 5}}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                type="number"
                domain={['auto', 'auto']}
                tickFormatter={formatDateLabel}
                tick={{ fontSize: 12 }}
                label={{
                  value: 'Date',
                  position: 'insideBottom',
                  offset: -5,
                }}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 12}}
                label={{
                  value: 'Net Saving',
                  position: 'left',
                  angle: -90,
                  offset: 50
                }}
              />
              <Tooltip
                content={(tooltipProps) => (
                    <CustomTooltip
                    {...tooltipProps}
                    predictionData={prediction}
                    />
                )}
       
              />

              {/* historical line */}
              <Line
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={2.5}
                activeDot={{ r: 6 }}
                name="Running Total"
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
                data={historicalChartData}
              />

              {/* predicted line */}
              {predictionSegmentData.length > 0 && (
                <Line
                    type="monotone"
                    dataKey="total"
                    stroke="green"
                    strokeWidth={2.5}
                    name="Predicted Next Saving"
                    data={predictionSegmentData}
                    strokeDasharray={"5 5"}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
