import { Commands } from 'atem-connection'
import { AtemCameraControlCategory, AtemCameraControlDisplayParameter, AtemCameraControlLensParameter } from '../ids'
import { constructNumberProps, constructBooleanProps } from './props'

export abstract class AtemCameraControlCommandGenerator<TRes> {
	protected abstract addCommand(command: Commands.CameraControlCommand): TRes

	// Iris

	focus(cameraId: number, value: number, relative = false): TRes {
		const command = new Commands.CameraControlCommand(
			cameraId,
			AtemCameraControlCategory.Lens,
			AtemCameraControlLensParameter.Focus,
			constructNumberProps(Commands.CameraControlDataType.FLOAT, [value], relative)
		)

		return this.addCommand(command)
	}

	triggerAutoFocus(cameraId: number): TRes {
		const command = new Commands.CameraControlCommand(
			cameraId,
			AtemCameraControlCategory.Lens,
			AtemCameraControlLensParameter.AutoFocus,
			constructBooleanProps([])
		)

		return this.addCommand(command)
	}

	irisFStop(cameraId: number, value: number, relative = false): TRes {
		const command = new Commands.CameraControlCommand(
			cameraId,
			AtemCameraControlCategory.Lens,
			AtemCameraControlLensParameter.ApertureFStop,
			constructNumberProps(Commands.CameraControlDataType.FLOAT, [value], relative)
		)

		return this.addCommand(command)
	}

	irisNormalised(cameraId: number, value: number, relative = false): TRes {
		const command = new Commands.CameraControlCommand(
			cameraId,
			AtemCameraControlCategory.Lens,
			AtemCameraControlLensParameter.ApertureNormalised,
			constructNumberProps(Commands.CameraControlDataType.FLOAT, [value], relative)
		)

		return this.addCommand(command)
	}

	triggerAutoIris(cameraId: number): TRes {
		const command = new Commands.CameraControlCommand(
			cameraId,
			AtemCameraControlCategory.Lens,
			AtemCameraControlLensParameter.AutoAperture,
			constructBooleanProps([])
		)

		return this.addCommand(command)
	}

	enableOpticalImageStabilisation(cameraId: number, enable: boolean): TRes {
		const command = new Commands.CameraControlCommand(
			cameraId,
			AtemCameraControlCategory.Lens,
			AtemCameraControlLensParameter.OpticalImageStabilisation,
			constructBooleanProps([enable])
		)

		return this.addCommand(command)
	}

	// Display

	displayColorBars(cameraId: number, enable: boolean): TRes {
		const command = new Commands.CameraControlCommand(
			cameraId,
			AtemCameraControlCategory.Display,
			AtemCameraControlDisplayParameter.ColorBarEnable,
			constructNumberProps(Commands.CameraControlDataType.SINT8, [enable ? 30 : 0])
		)

		return this.addCommand(command)
	}
}
