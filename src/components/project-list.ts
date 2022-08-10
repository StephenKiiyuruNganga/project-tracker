import { autobind } from "../decorators/autobind.js"
import { DragTarget } from "../models/drag-drop.js"
import { Project, projectState, ProjectStatus } from "../state/project-state.js"
import { Component } from "./base-components.js"
import { ProjectItem } from "./project-item.js"

// ProjectList Class
export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[]

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`)

    this.assignedProjects = []

    this.configure()
    this.renderContent()
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault()
      const listEl = this.element.querySelector("ul")!
      listEl.classList.add("droppable")
    }
  }
  @autobind
  dropHandler(event: DragEvent) {
    const projectID = event.dataTransfer!.getData("text/plain")
    projectState.moveProject(
      projectID,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    )
  }

  @autobind
  dragLeaveHandler(event: DragEvent) {
    const listEl = this.element.querySelector("ul")!
    listEl.classList.remove("droppable")
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement

    listEl.innerHTML = ""

    for (const project of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, project)
    }
  }

  configure() {
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((project) => {
        if (this.type === "active") {
          return project.status === ProjectStatus.Active
        }
        return project.status === ProjectStatus.Finished
      })

      this.assignedProjects = relevantProjects
      this.renderProjects()
    })

    this.element.addEventListener("dragover", this.dragOverHandler)
    this.element.addEventListener("dragleave", this.dragLeaveHandler)
    this.element.addEventListener("drop", this.dropHandler)
  }

  renderContent() {
    const listId = `${this.type}-projects-list`
    this.element.querySelector("ul")!.id = listId
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS"
  }
}
