import {
  Component, signal, computed, ChangeDetectionStrategy, AfterViewInit, inject, NgZone, NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import {
  FFlowModule, FCanvasComponent, EFConnectionType, EFConnectableSide
} from '@foblex/flow';

interface WorkflowNode {
  id: string;
  type: 'start' | 'process' | 'decision' | 'end' | 'api' | 'email';
  label: string;
  sublabel?: string;
  position: { x: number; y: number };
}

interface WorkflowConnection {
  id: string;
  outputId: string;
  inputId: string;
  label?: string;
}

@Component({
  selector: 'app-diagrams',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, MatChipsModule,
    FFlowModule,
  ] as any,
  template: `
    <div class="space-y-4 animate-fade-in" style="height: calc(100vh - 140px); display:flex; flex-direction:column;">

      <!-- Header -->
      <div class="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 class="text-2xl font-bold text-primary">Workflow Diagrams</h1>
          <p class="text-sm mt-0.5" style="color:var(--text-muted)">
            Interactive node-based workflow builder · Drag nodes to reposition
          </p>
        </div>
        <div class="flex items-center gap-2">
          <mat-chip-set>
            <mat-chip>{{ nodes().length }} Nodes</mat-chip>
            <mat-chip>{{ connections().length }} Connections</mat-chip>
          </mat-chip-set>
          <button mat-stroked-button (click)="resetLayout()"
            style="border-color:var(--border-default);color:var(--text-secondary)">
            <mat-icon style="font-size:18px;width:18px;height:18px;line-height:18px">refresh</mat-icon>
            Reset
          </button>
          <button mat-flat-button
            style="background:var(--accent-600);color:#fff">
            <mat-icon style="font-size:18px;width:18px;height:18px;line-height:18px">save</mat-icon>
            Save
          </button>
        </div>
      </div>

      <!-- Toolbar: Node palette -->
      <div class="card !py-3 !px-4 flex items-center gap-3 flex-shrink-0">
        <span class="text-xs font-medium" style="color:var(--text-muted)">ADD NODE</span>
        <div class="flex gap-2">
          @for (type of nodeTypes; track type.key) {
            <button class="palette-btn" [style.border-color]="type.color"
              (click)="addNode(type.key)"
              [matTooltip]="'Add ' + type.label">
              <mat-icon [style.color]="type.color"
                style="font-size:16px;width:16px;height:16px;line-height:16px">{{ type.icon }}</mat-icon>
              <span class="text-xs" style="color:var(--text-secondary)">{{ type.label }}</span>
            </button>
          }
        </div>
        <div class="ml-auto flex items-center gap-2 text-xs" style="color:var(--text-muted)">
          <mat-icon style="font-size:14px;width:14px;height:14px;line-height:14px">open_with</mat-icon>
          Drag to move
          <mat-icon style="font-size:14px;width:14px;height:14px;line-height:14px;margin-left:8px">mouse</mat-icon>
          Scroll to zoom
          <mat-icon style="font-size:14px;width:14px;height:14px;line-height:14px;margin-left:8px">swipe</mat-icon>
          Drag canvas to pan
        </div>
      </div>

      <!-- Flow canvas -->
      <div class="card !p-0 overflow-hidden flex-1" style="min-height:0">
        <f-flow fDraggable class="flow-host" style="width:100%;height:100%">
          <f-canvas>

            <!-- Connections -->
            @for (conn of connections(); track conn.id) {
              <f-connection
                [fConnectionId]="conn.id"
                [fOutputId]="conn.outputId"
                [fInputId]="conn.inputId"
                [fType]="connectionType"
                [fOutputSide]="rightSide"
                [fInputSide]="leftSide">
              </f-connection>
            }

            <!-- Nodes -->
            @for (node of nodes(); track node.id) {
              <div
                fNode fDragHandle
                [fNodeId]="node.id"
                [fNodePosition]="node.position"
                (fNodePositionChange)="onNodeMove(node.id, $any($event))"
                class="wf-node" [attr.data-type]="node.type">

                <!-- Output connector (right) -->
                @if (node.type !== 'end') {
                  <div fNodeOutput
                    [fOutputId]="node.id + '-out'"
                    [fOutputConnectableSide]="rightSide"
                    class="wf-connector wf-connector-out">
                  </div>
                }

                <!-- Input connector (left) -->
                @if (node.type !== 'start') {
                  <div fNodeInput
                    [fInputId]="node.id + '-in'"
                    [fInputConnectableSide]="leftSide"
                    class="wf-connector wf-connector-in">
                  </div>
                }

                <!-- Node content -->
                <div class="wf-node-inner">
                  <div class="wf-node-icon" [attr.data-type]="node.type">
                    <mat-icon style="font-size:18px;width:18px;height:18px;line-height:18px">
                      {{ iconFor(node.type) }}
                    </mat-icon>
                  </div>
                  <div class="wf-node-text">
                    <div class="wf-node-label">{{ node.label }}</div>
                    @if (node.sublabel) {
                      <div class="wf-node-sub">{{ node.sublabel }}</div>
                    }
                  </div>
                  <button class="wf-delete-btn" (click)="removeNode(node.id)"
                    [matTooltip]="'Remove node'">
                    <mat-icon style="font-size:14px;width:14px;height:14px;line-height:14px">close</mat-icon>
                  </button>
                </div>

              </div>
            }

          </f-canvas>
        </f-flow>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }

    .flow-host {
      background: var(--bg-elevated);
      background-image:
        radial-gradient(circle, var(--border-default) 1px, transparent 1px);
      background-size: 24px 24px;
    }

    .palette-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 10px; border-radius: var(--radius-md);
      border: 1px solid; background: transparent; cursor: pointer;
      transition: background 150ms ease;
      &:hover { background: var(--bg-elevated); }
    }

    /* Nodes */
    .wf-node {
      position: relative;
      min-width: 160px;
      cursor: grab;
      &:active { cursor: grabbing; }
    }
    .wf-node-inner {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px;
      background: var(--bg-surface);
      border: 2px solid var(--border-default);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
      transition: border-color 150ms, box-shadow 150ms;
      &:hover {
        box-shadow: var(--shadow-card-hover);
      }
    }
    .wf-node[data-type="start"]   .wf-node-inner { border-color: #22c55e; }
    .wf-node[data-type="end"]     .wf-node-inner { border-color: #ef4444; }
    .wf-node[data-type="decision"].wf-node-inner { border-color: #f59e0b; }
    .wf-node[data-type="api"]     .wf-node-inner { border-color: var(--accent-500); }
    .wf-node[data-type="email"]   .wf-node-inner { border-color: #06b6d4; }
    .wf-node[data-type="process"] .wf-node-inner { border-color: var(--border-default); }

    .wf-node-icon {
      width: 32px; height: 32px; border-radius: var(--radius-sm);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .wf-node-icon[data-type="start"]    { background: #dcfce7; color: #15803d; }
    .wf-node-icon[data-type="end"]      { background: #fee2e2; color: #b91c1c; }
    .wf-node-icon[data-type="decision"] { background: #fef9c3; color: #854d0e; }
    .wf-node-icon[data-type="api"]      { background: var(--accent-100); color: var(--accent-700); }
    .wf-node-icon[data-type="email"]    { background: #cffafe; color: #0e7490; }
    .wf-node-icon[data-type="process"]  { background: var(--bg-elevated); color: var(--text-secondary); }

    .wf-node-label {
      font-size: 0.8125rem; font-weight: 600;
      color: var(--text-primary); line-height: 1.2;
    }
    .wf-node-sub {
      font-size: 0.6875rem; color: var(--text-muted); margin-top: 1px;
    }
    .wf-node-text { flex: 1; min-width: 0; }

    .wf-delete-btn {
      opacity: 0; border: none; background: none; cursor: pointer;
      padding: 2px; border-radius: 4px; color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
      transition: opacity 150ms, color 150ms;
      &:hover { color: var(--danger); }
    }
    .wf-node:hover .wf-delete-btn { opacity: 1; }

    /* Connectors */
    .wf-connector {
      position: absolute; top: 50%; transform: translateY(-50%);
      width: 12px; height: 12px; border-radius: 50%;
      background: var(--bg-surface);
      border: 2px solid var(--accent-500);
      cursor: crosshair; z-index: 10;
      transition: background 150ms, transform 150ms;
      &:hover { background: var(--accent-500); transform: translateY(-50%) scale(1.2); }
    }
    .wf-connector-out { right: -7px; }
    .wf-connector-in  { left: -7px; }

    /* Foblex connection path color */
    ::ng-deep .f-connection-path { stroke: var(--accent-500) !important; stroke-width: 2 !important; }
    ::ng-deep .f-connection-selection { stroke-width: 8 !important; stroke: transparent !important; }
    ::ng-deep .f-connection-path:hover,
    ::ng-deep .f-connection.f-selected .f-connection-path { stroke: var(--accent-600) !important; stroke-width: 2.5 !important; }
  `],
})
export default class DiagramsComponent {
  readonly connectionType = EFConnectionType.BEZIER;
  readonly rightSide = EFConnectableSide.RIGHT;
  readonly leftSide  = EFConnectableSide.LEFT;

  nodeTypes = [
    { key: 'process'  as const, label: 'Process',  icon: 'settings',       color: 'var(--border-default)' },
    { key: 'decision' as const, label: 'Decision', icon: 'help_outline',   color: '#f59e0b' },
    { key: 'api'      as const, label: 'API Call',  icon: 'cloud',          color: 'var(--accent-500)' },
    { key: 'email'    as const, label: 'Email',    icon: 'mail',            color: '#06b6d4' },
  ];

  nodes = signal<WorkflowNode[]>([
    { id: 'n1', type: 'start',    label: 'Start',           sublabel: 'Trigger event',     position: { x: 40,  y: 120 } },
    { id: 'n2', type: 'process',  label: 'Validate Input',  sublabel: 'Check form data',   position: { x: 240, y: 60 } },
    { id: 'n3', type: 'decision', label: 'Is Valid?',       sublabel: 'Branch condition',  position: { x: 460, y: 60 } },
    { id: 'n4', type: 'api',      label: 'API Request',     sublabel: 'POST /api/submit',  position: { x: 680, y: 40 } },
    { id: 'n5', type: 'email',    label: 'Send Email',      sublabel: 'notify@domain.com', position: { x: 680, y: 200 } },
    { id: 'n6', type: 'process',  label: 'Log Error',       sublabel: 'error.log',         position: { x: 460, y: 230 } },
    { id: 'n7', type: 'end',      label: 'End',             sublabel: 'Workflow complete', position: { x: 900, y: 120 } },
  ]);

  connections = signal<WorkflowConnection[]>([
    { id: 'c1', outputId: 'n1-out', inputId: 'n2-in' },
    { id: 'c2', outputId: 'n2-out', inputId: 'n3-in' },
    { id: 'c3', outputId: 'n3-out', inputId: 'n4-in', label: 'Yes' },
    { id: 'c4', outputId: 'n4-out', inputId: 'n5-in' },
    { id: 'c5', outputId: 'n5-out', inputId: 'n7-in' },
    { id: 'c6', outputId: 'n3-out', inputId: 'n6-in', label: 'No' },
    { id: 'c7', outputId: 'n6-out', inputId: 'n7-in' },
  ]);

  iconFor(type: WorkflowNode['type']): string {
    const map: Record<WorkflowNode['type'], string> = {
      start: 'play_arrow', process: 'settings', decision: 'help_outline',
      end: 'stop', api: 'cloud', email: 'mail',
    };
    return map[type];
  }

  addNode(type: WorkflowNode['type']) {
    const id = 'n' + Date.now();
    const labels: Record<WorkflowNode['type'], { label: string; sublabel: string }> = {
      start:    { label: 'Start',    sublabel: 'Trigger'       },
      process:  { label: 'Process',  sublabel: 'Add logic here' },
      decision: { label: 'Decision', sublabel: 'Branch here'   },
      end:      { label: 'End',      sublabel: 'Complete'       },
      api:      { label: 'API Call', sublabel: 'POST /endpoint' },
      email:    { label: 'Email',    sublabel: 'Send to user'  },
    };
    const offset = this.nodes().length * 20;
    this.nodes.update(ns => [...ns, {
      id, type,
      label:    labels[type].label,
      sublabel: labels[type].sublabel,
      position: { x: 200 + offset, y: 200 + offset },
    }]);
  }

  removeNode(id: string) {
    this.nodes.update(ns => ns.filter(n => n.id !== id));
    this.connections.update(cs => cs.filter(c =>
      !c.outputId.startsWith(id + '-') && !c.inputId.startsWith(id + '-')
    ));
  }

  onNodeMove(id: string, pos: { x: number; y: number }) {
    this.nodes.update(ns => ns.map(n => n.id === id ? { ...n, position: pos } : n));
  }

  resetLayout() {
    this.nodes.set([
      { id: 'n1', type: 'start',    label: 'Start',           sublabel: 'Trigger event',     position: { x: 40,  y: 120 } },
      { id: 'n2', type: 'process',  label: 'Validate Input',  sublabel: 'Check form data',   position: { x: 240, y: 60 } },
      { id: 'n3', type: 'decision', label: 'Is Valid?',       sublabel: 'Branch condition',  position: { x: 460, y: 60 } },
      { id: 'n4', type: 'api',      label: 'API Request',     sublabel: 'POST/api/submit',  position: { x: 680, y: 40 } },
      { id: 'n5', type: 'email',    label: 'Send Email',      sublabel: 'notify@domain.com', position: { x: 680, y: 200 } },
      { id: 'n6', type: 'process',  label: 'Log Error',       sublabel: 'error.log',         position: { x: 460, y: 230 } },
      { id: 'n7', type: 'end',      label: 'End',             sublabel: 'Workflow complete', position: { x: 900, y: 120 } },
    ]);
    this.connections.set([
      { id: 'c1', outputId: 'n1-out', inputId: 'n2-in' },
      { id: 'c2', outputId: 'n2-out', inputId: 'n3-in' },
      { id: 'c3', outputId: 'n3-out', inputId: 'n4-in' },
      { id: 'c4', outputId: 'n4-out', inputId: 'n5-in' },
      { id: 'c5', outputId: 'n5-out', inputId: 'n7-in' },
      { id: 'c6', outputId: 'n3-out', inputId: 'n6-in' },
      { id: 'c7', outputId: 'n6-out', inputId: 'n7-in' },
    ]);
  }
}