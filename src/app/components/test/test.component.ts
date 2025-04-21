import { Component } from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { SettingsComponent } from '../settings/settings.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatRadioModule,MatSelectModule,MatInputModule, MatButtonModule,MatIconModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  toolboxItems = [
    { type: 'text', label: 'Text' },
    { type: 'radio', label: 'Radio Button' },
    { type: 'dropdown', label: 'Dropdown' }
  ];

  droppedItems: any[] = [];

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.droppedItems, event.previousIndex, event.currentIndex);
    } else if (event.previousContainer.id === 'toolbox') {
      const draggedItem = this.toolboxItems[event.previousIndex];
      this.droppedItems.push({ ...draggedItem });
    }
  }

  removeItem(index: number) {
    this.droppedItems.splice(index, 1);
  }
}
