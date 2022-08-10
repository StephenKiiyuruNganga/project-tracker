import { autobind } from "../decorators/autobind.js"
import { projectState } from "../state/project-state.js"
import { Validatable, validate } from "../util/validation.js"
import { Component } from "./base-components.js"

// ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement
  descriptionInputElement: HTMLInputElement
  peopleInputElement: HTMLInputElement

  constructor() {
    super("project-input", "app", true, "user-input")
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement
    this.configure()
  }

  configure() {
    // manual binding:
    // this.element.addEventListener("submit", this.submitHandler.bind(this))

    this.element.addEventListener("submit", this.submitHandler)
  }

  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const title = this.titleInputElement.value
    const description = this.descriptionInputElement.value
    const people = this.peopleInputElement.value

    const validatableTitle: Validatable = {
      value: title,
      required: true,
      minLength: 3,
    }
    const validatableDescription: Validatable = {
      value: description,
      required: true,
      minLength: 5,
    }
    const validatablePeople: Validatable = {
      value: +people,
      required: true,
      min: 1,
      max: 5,
    }

    if (
      !validate(validatableTitle) ||
      !validate(validatableDescription) ||
      !validate(validatablePeople)
    ) {
      alert("Invalid input")
      return
    } else {
      return [title, description, +people]
    }
  }

  private clearInputs() {
    this.titleInputElement.value = ""
    this.descriptionInputElement.value = ""
    this.peopleInputElement.value = ""
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault()
    const userInput = this.gatherUserInput()
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput
      // console.log(userInput)
      projectState.addProject(title, desc, people)
      this.clearInputs()
    }
  }
}
