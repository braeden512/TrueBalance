// abstracted this out to a service so we dont handle requests/responses and regression logic in the same file
// this handles the regression logic
// also changed so that it predicts net saving at a given epoch time, not for a given month

import { SimpleLinearRegression } from 'ml-regression-simple-linear';

export function predictNetSavingFromTransactions(transactions, epochTime) {
	// need at least 5 data points to make a prediction
	if (transactions.length < 5) {
		return {
			data_size: transactions.length,
			error: 'Insufficient data',
		};
	}

	let cumulativeNetSaving = 0;
	const dataRows = [];

	transactions.forEach((transaction) => {
		const { amount, EconomyType, created_at } = transaction;
		const num_amount = Number(amount);

		if (EconomyType === 'Source') {
			cumulativeNetSaving += num_amount;
		} else {
			cumulativeNetSaving -= num_amount;
		}

		dataRows.push({
			cumulative_sum: cumulativeNetSaving,
			epoch_time: new Date(created_at).getTime(),
		});
	});

	// ensure transactions span at least 7 days for meaningful predictions
	const timestamps = dataRows.map((d) => d.epoch_time);
	const timeSpread = Math.max(...timestamps) - Math.min(...timestamps);
	const daysSpread = timeSpread / (1000 * 60 * 60 * 24);

	if (daysSpread < 7) {
		return {
			data_size: transactions.length,
			error: 'Insufficient time range',
		};
	}

	const X_data = dataRows.map((data) => data.epoch_time);
	const Y_data = dataRows.map((data) => data.cumulative_sum);

	if (X_data.length === 0 || Y_data.length === 0) {
		throw new Error('No data for prediction');
	}

	const regression = new SimpleLinearRegression(X_data, Y_data);

	const predictedNextNetSaving = regression.predict(epochTime);

	return {
		data_size: transactions.length,
		predict_x_epoch: epochTime,
		predict_y_net_saving: predictedNextNetSaving,
		regression: {
			slope: regression.slope,
			intercept: regression.intercept,
		},
	};
}
