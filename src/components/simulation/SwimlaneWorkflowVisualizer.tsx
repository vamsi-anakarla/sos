import { useId } from 'react';
import {
  AlertTriangle,
  Ambulance,
  Bell,
  Check,
  CheckCircle,
  Compass,
  FileText,
  Flag,
  HelpCircle,
  Inbox,
  LogIn,
  MapPin,
  Map,
  Play,
  Search,
  Send,
  Slash,
  Smartphone,
  Star,
  Target,
  ToggleRight,
  Truck,
  UserCheck,
  XCircle,
} from 'lucide-react';
import type { AmbulanceRequest, Ambulance as AmbulanceType } from '@/types';

export interface SwimlaneVisualizerProps {
  requests?: AmbulanceRequest[];
  ambulances?: AmbulanceType[];
  selectedRequest?: AmbulanceRequest;
  currentSimStep?: number;
  isDeclineSimulated?: boolean;
  onSelectRequest?: (req: AmbulanceRequest) => void;
  onAssign?: (requestId: string, ambulanceId: string) => void;
  onOperatorDecline?: (requestId: string, reason: string) => void;
}

export default function SwimlaneWorkflowVisualizer({
  currentSimStep = 1,
  isDeclineSimulated = false,
}: SwimlaneVisualizerProps) {
  const filterId = useId();

  // Helper to determine active node based on the 11 easy-to-understand simulation steps
  const isNodeActive = (nodeId: string) => {
    switch (nodeId) {
      case 'Need ambulance':
      case 'Open app':
        return currentSimStep === 1;
      case 'Share location':
        return currentSimStep === 2;
      case 'Enter basic details':
      case 'Request submitted':
        return currentSimStep === 3;
      case 'Request received':
        return currentSimStep === 4;
      case 'Check availability':
      case 'Select suitable ambulance':
        return currentSimStep === 5;
      case 'Dispatcher confirms?':
      case 'Confirm assignment':
      case 'Assignment sent':
        return currentSimStep === 6;
      case 'Receive request':
      case 'Accept or decline?':
        return currentSimStep === 7;
      case 'Navigate to patient':
      case 'Track ambulance':
        return currentSimStep === 8 && !isDeclineSimulated;
      case 'Ambulance arrives':
      case 'Patient picked up':
        return currentSimStep === 9;
      case 'Navigate to hospital':
      case 'Complete trip':
      case 'Trip_done_ambulance':
        return currentSimStep === 10;
      case 'View trip status':
      case 'Give feedback':
      case 'Trip_done_patient':
        return currentSimStep >= 11;
      case 'Decline request':
      case 'Request declined':
        return isDeclineSimulated;
      default:
        return false;
    }
  };

  const isNodeCompleted = (nodeId: string) => {
    switch (nodeId) {
      case 'Need ambulance':
      case 'Open app':
        return currentSimStep > 1;
      case 'Share location':
        return currentSimStep > 2;
      case 'Enter basic details':
      case 'Request submitted':
        return currentSimStep > 3;
      case 'Request received':
        return currentSimStep > 4;
      case 'Check availability':
      case 'Select suitable ambulance':
        return currentSimStep > 5;
      case 'Dispatcher confirms?':
      case 'Confirm assignment':
      case 'Assignment sent':
        return currentSimStep > 6;
      case 'Receive request':
      case 'Accept or decline?':
        return currentSimStep > 7;
      case 'Navigate to patient':
      case 'Track ambulance':
        return currentSimStep > 8;
      case 'Ambulance arrives':
      case 'Patient picked up':
        return currentSimStep > 9;
      case 'Navigate to hospital':
      case 'Complete trip':
      case 'Trip_done_ambulance':
        return currentSimStep > 10;
      case 'View trip status':
      case 'Give feedback':
      case 'Trip_done_patient':
        return currentSimStep >= 11;
      default:
        return false;
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border-4 border-ink bg-[#fdfdfd] p-3 shadow-panel">
      {/* Title header bar above SVG */}
      <div className="mb-2 flex items-center justify-between border-b border-ink/15 pb-2">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-800 text-white text-[10px] font-bold">
            ⚡
          </span>
          <span className="font-display text-sm sm:text-base tracking-wide text-ink">
            Ambulance Coordination Platform • Live Process Flow
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-ink/70">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-comic-red animate-pulse" />
            <span>Active Step: {currentSimStep} of 11</span>
          </span>
          <span className="hidden sm:inline text-ink/40">•</span>
          <span className="hidden sm:inline font-sans text-ink/60">Live Step Tracking</span>
        </div>
      </div>

      <div className="min-w-[1050px]">
        <svg
          viewBox="0 0 2120 735"
          className="w-full h-auto drop-shadow-sm select-none"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
        >
          <defs>
            {/* Arrowhead Markers */}
            <marker
              id={`arrow-black-${filterId}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#242424" />
            </marker>

            <marker
              id={`arrow-blue-${filterId}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#2866c4" />
            </marker>

            <marker
              id={`arrow-amber-${filterId}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#c38424" />
            </marker>

            <marker
              id={`arrow-green-${filterId}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#30a050" />
            </marker>

            <marker
              id={`arrow-red-${filterId}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#dc2626" />
            </marker>

            <filter id={`glow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ffd93d" floodOpacity="0.95" />
            </filter>
          </defs>

          {/* ================================================================= */}
          {/* LANE 1: PATIENT / FAMILY (Blue) */}
          {/* ================================================================= */}
          <rect
            x="15"
            y="15"
            width="2090"
            height="169"
            rx="8"
            fill="#f7f9fd"
            stroke="#2866c4"
            strokeWidth="1.5"
          />
          {/* Lane Label */}
          <rect x="15" y="15" width="22" height="169" rx="8" fill="#2866c4" />
          <text
            x="-100"
            y="31"
            transform="rotate(-90)"
            fill="#ffffff"
            fontSize="12"
            fontWeight="bold"
            letterSpacing="2"
            textAnchor="middle"
          >
            PATIENT / FAMILY
          </text>
          <text x="45" y="42" fill="#2866c4" fontSize="12" fontWeight="bold">
            PATIENT APP
          </text>

          {/* ================================================================= */}
          {/* LANE 2: CENTRAL DISPATCH (Orange / Amber) */}
          {/* ================================================================= */}
          <rect
            x="15"
            y="219"
            width="2090"
            height="169"
            rx="8"
            fill="#fdfbf6"
            stroke="#c38424"
            strokeWidth="1.5"
          />
          {/* Lane Label */}
          <rect x="15" y="219" width="22" height="169" rx="8" fill="#c38424" />
          <text
            x="-304"
            y="31"
            transform="rotate(-90)"
            fill="#ffffff"
            fontSize="12"
            fontWeight="bold"
            letterSpacing="2"
            textAnchor="middle"
          >
            CENTRAL DISPATCH
          </text>
          <text x="45" y="246" fill="#c38424" fontSize="12" fontWeight="bold">
            DISPATCH SYSTEM
          </text>

          {/* ================================================================= */}
          {/* LANE 3: AMBULANCE OPERATOR (Green) */}
          {/* ================================================================= */}
          <rect
            x="15"
            y="423"
            width="2090"
            height="297"
            rx="8"
            fill="#f7fdf9"
            stroke="#30a050"
            strokeWidth="1.5"
          />
          {/* Lane Label */}
          <rect x="15" y="423" width="22" height="297" rx="8" fill="#30a050" />
          <text
            x="-571"
            y="31"
            transform="rotate(-90)"
            fill="#ffffff"
            fontSize="12"
            fontWeight="bold"
            letterSpacing="2"
            textAnchor="middle"
          >
            AMBULANCE OPERATOR
          </text>
          <text x="45" y="450" fill="#30a050" fontSize="12" fontWeight="bold">
            AMBULANCE APP
          </text>

          {/* ================================================================= */}
          {/* CROSS-LANE ARROWS & LABELS */}
          {/* ================================================================= */}

          {/* 1. Request submitted --> Request received : Request */}
          <path
            d="M896,104 L863,104 L863,164 L226,164 L226,292 L171,292"
            fill="none"
            stroke={currentSimStep >= 3 ? '#2866c4' : '#9ca3af'}
            strokeWidth={currentSimStep === 3 ? '2.5' : '1.5'}
            strokeDasharray="6,4"
            markerEnd={`url(#arrow-blue-${filterId})`}
          />
          <g transform="translate(521, 144)">
            <rect x="0" y="0" width="59" height="18" rx="4" fill="#ffffff" stroke="#2866c4" strokeWidth="0.8" />
            <text x="29.5" y="13" fill="#2866c4" fontSize="10" fontWeight="bold" textAnchor="middle">
              Request
            </text>
          </g>

          {/* 2. Confirm assignment --> Track ambulance : Confirmation */}
          <path
            d="M1034,271 L1090,271 L1090,201 L1068,201 L1068,96 L1101,96"
            fill="none"
            stroke={currentSimStep >= 6 ? '#c38424' : '#9ca3af'}
            strokeWidth={currentSimStep === 6 ? '2.5' : '1.5'}
            strokeDasharray="6,4"
            markerEnd={`url(#arrow-amber-${filterId})`}
          />
          <g transform="translate(1032, 140)">
            <rect x="0" y="0" width="84" height="18" rx="4" fill="#ffffff" stroke="#c38424" strokeWidth="0.8" />
            <text x="42" y="13" fill="#c38424" fontSize="10" fontWeight="bold" textAnchor="middle">
              Confirmation
            </text>
          </g>

          {/* 3. Confirm assignment --> Receive request : Assignment */}
          <path
            d="M896,317 L841,317 L841,405 L863,405 L863,496 L786,496"
            fill="none"
            stroke={currentSimStep >= 6 ? '#c38424' : '#9ca3af'}
            strokeWidth={currentSimStep === 6 ? '2.5' : '1.5'}
            strokeDasharray="6,4"
            markerEnd={`url(#arrow-amber-${filterId})`}
          />
          <g transform="translate(808, 345)">
            <rect x="0" y="0" width="78" height="18" rx="4" fill="#ffffff" stroke="#c38424" strokeWidth="0.8" />
            <text x="39" y="13" fill="#c38424" fontSize="10" fontWeight="bold" textAnchor="middle">
              Assignment
            </text>
          </g>

          {/* 4. Decline request --> Check availability : Declined */}
          <path
            d="M1101,485 L1046,485 L1046,446 L453,446 L453,308 L419,308"
            fill="none"
            stroke={isDeclineSimulated ? '#dc2626' : '#9ca3af'}
            strokeWidth={isDeclineSimulated ? '2.5' : '1.5'}
            strokeDasharray="6,4"
            markerEnd={isDeclineSimulated ? `url(#arrow-red-${filterId})` : `url(#arrow-black-${filterId})`}
          />
          <g transform="translate(725, 430)">
            <rect x="0" y="0" width="62" height="18" rx="4" fill="#ffffff" stroke={isDeclineSimulated ? '#dc2626' : '#9ca3af'} strokeWidth="0.8" />
            <text x="31" y="13" fill={isDeclineSimulated ? '#dc2626' : '#6b7280'} fontSize="10" fontWeight="bold" textAnchor="middle">
              Declined
            </text>
          </g>

          {/* 5. Navigate to patient --> Ambulance arrives : Arriving */}
          <path
            d="M1239,636 L1284,636 L1284,104 L1349,104"
            fill="none"
            stroke={currentSimStep >= 8 ? '#30a050' : '#9ca3af'}
            strokeWidth={currentSimStep === 8 ? '2.5' : '1.5'}
            strokeDasharray="6,4"
            markerEnd={`url(#arrow-green-${filterId})`}
          />
          <g transform="translate(1262, 285)">
            <rect x="0" y="0" width="55" height="18" rx="4" fill="#ffffff" stroke="#30a050" strokeWidth="0.8" />
            <text x="27.5" y="13" fill="#30a050" fontSize="10" fontWeight="bold" textAnchor="middle">
              Arriving
            </text>
          </g>

          {/* 6. Complete trip --> View trip status : Trip completed */}
          <path
            d="M1717,496 L1698,496 L1698,110 L1649,110"
            fill="none"
            stroke={currentSimStep >= 10 ? '#30a050' : '#9ca3af'}
            strokeWidth={currentSimStep === 10 ? '2.5' : '1.5'}
            strokeDasharray="6,4"
            markerEnd={`url(#arrow-green-${filterId})`}
          />
          <g transform="translate(1657, 285)">
            <rect x="0" y="0" width="95" height="18" rx="4" fill="#ffffff" stroke="#30a050" strokeWidth="0.8" />
            <text x="47.5" y="13" fill="#30a050" fontSize="10" fontWeight="bold" textAnchor="middle">
              Trip completed
            </text>
          </g>

          {/* ================================================================= */}
          {/* LANE 1 SEQUENTIAL NODES & ARROWS */}
          {/* ================================================================= */}
          {/* Need ambulance (Start Event) */}
          <SvgEventNode
            x={120}
            y={71}
            title="Need ambulance"
            icon={AlertTriangle}
            type="start"
            isActive={isNodeActive('Need ambulance')}
            isCompleted={isNodeCompleted('Need ambulance')}
            filterId={filterId}
          />
          <path d="M171.9,96 L279,96" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Open app */}
          <SvgActivityNode
            x={281}
            y={60}
            title="Open app"
            icon={Smartphone}
            isActive={isNodeActive('Open app')}
            isCompleted={isNodeCompleted('Open app')}
            filterId={filterId}
          />
          <path d="M419,96 L486,96" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Share location */}
          <SvgActivityNode
            x={486}
            y={60}
            title="Share location"
            icon={MapPin}
            badge="GPS"
            isActive={isNodeActive('Share location')}
            isCompleted={isNodeCompleted('Share location')}
            filterId={filterId}
          />
          <path d="M624,96 L691,96" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Enter basic details */}
          <SvgActivityNode
            x={691}
            y={60}
            title="Enter basic details"
            icon={FileText}
            isActive={isNodeActive('Enter basic details')}
            isCompleted={isNodeCompleted('Enter basic details')}
            filterId={filterId}
          />
          <path d="M829,92 L896,92" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Request submitted */}
          <SvgActivityNode
            x={896}
            y={60}
            title="Request submitted"
            icon={Send}
            isActive={isNodeActive('Request submitted')}
            isCompleted={isNodeCompleted('Request submitted')}
            filterId={filterId}
          />

          {/* Track ambulance */}
          <SvgActivityNode
            x={1101}
            y={60}
            title="Track ambulance"
            icon={Compass}
            isActive={isNodeActive('Track ambulance')}
            isCompleted={isNodeCompleted('Track ambulance')}
            filterId={filterId}
          />
          <path d="M1239,92 L1348.3,92" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Ambulance arrives (Event) */}
          <SvgEventNode
            x={1350}
            y={71}
            title="Ambulance arrives"
            icon={Truck}
            type="intermediate"
            isActive={isNodeActive('Ambulance arrives')}
            isCompleted={isNodeCompleted('Ambulance arrives')}
            filterId={filterId}
          />
          <path d="M1401.9,96 L1509,96" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* View trip status */}
          <SvgActivityNode
            x={1511}
            y={60}
            title="View trip status"
            icon={FileText}
            isActive={isNodeActive('View trip status')}
            isCompleted={isNodeCompleted('View trip status')}
            filterId={filterId}
          />
          <path d="M1649,87 L1716,87" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Give feedback */}
          <SvgActivityNode
            x={1716}
            y={60}
            title="Give feedback"
            icon={Star}
            isActive={isNodeActive('Give feedback')}
            isCompleted={isNodeCompleted('Give feedback')}
            filterId={filterId}
          />
          <path d="M1854,96 L1963,96" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Trip completed (End Event) */}
          <SvgEventNode
            x={1965}
            y={71}
            title="Trip completed"
            icon={CheckCircle}
            type="end"
            isActive={isNodeActive('Trip_done_patient')}
            isCompleted={isNodeCompleted('Trip_done_patient')}
            filterId={filterId}
          />

          {/* ================================================================= */}
          {/* LANE 2 SEQUENTIAL NODES & ARROWS */}
          {/* ================================================================= */}
          {/* Request received */}
          <SvgEventNode
            x={120}
            y={275}
            title="Request received"
            icon={Inbox}
            type="start"
            isActive={isNodeActive('Request received')}
            isCompleted={isNodeCompleted('Request received')}
            filterId={filterId}
          />
          <path d="M171.7,304 L279,304" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Check availability */}
          <SvgActivityNode
            x={281}
            y={264}
            title="Check availability"
            icon={Search}
            isActive={isNodeActive('Check availability')}
            isCompleted={isNodeCompleted('Check availability')}
            filterId={filterId}
          />
          <path d="M419,296 L486,296" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Select suitable ambulance */}
          <SvgActivityNode
            x={486}
            y={264}
            title="Select suitable ambulance"
            icon={Target}
            isActive={isNodeActive('Select suitable ambulance')}
            isCompleted={isNodeCompleted('Select suitable ambulance')}
            filterId={filterId}
          />
          <path d="M624,287 L749,287" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Dispatcher confirms? (Gateway) */}
          <SvgGatewayNode
            x={735}
            y={275}
            title="Dispatcher confirms?"
            icon={HelpCircle}
            isActive={isNodeActive('Dispatcher confirms?')}
            filterId={filterId}
          />

          {/* Loopback Arrow: Rejected */}
          <path
            d="M748,313 L626,313"
            fill="none"
            stroke="#242424"
            strokeWidth="1.2"
            markerEnd={`url(#arrow-black-${filterId})`}
          />
          <g transform="translate(655, 298)">
            <rect x="0" y="0" width="55" height="16" fill="#ffffff" rx="3" stroke="#242424" strokeWidth="0.75" />
            <text x="27.5" y="12" fill="#1c1c1c" fontSize="9" fontWeight="bold" textAnchor="middle">
              Rejected
            </text>
          </g>

          {/* Forward Arrow: Confirmed */}
          <path
            d="M781.3,297 L894,297"
            fill="none"
            stroke="#242424"
            strokeWidth="1.2"
            markerEnd={`url(#arrow-black-${filterId})`}
          />
          <g transform="translate(811, 282)">
            <rect x="0" y="0" width="62" height="16" fill="#ffffff" rx="3" stroke="#242424" strokeWidth="0.75" />
            <text x="31" y="12" fill="#1c1c1c" fontSize="9" fontWeight="bold" textAnchor="middle">
              Confirmed
            </text>
          </g>

          {/* Confirm assignment */}
          <SvgActivityNode
            x={896}
            y={264}
            title="Confirm assignment"
            icon={Check}
            isActive={isNodeActive('Confirm assignment')}
            isCompleted={isNodeCompleted('Confirm assignment')}
            filterId={filterId}
          />
          <path d="M1034,296 L1145,296" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Assignment sent */}
          <SvgEventNode
            x={1145}
            y={275}
            title="Assignment sent"
            icon={Send}
            type="intermediate"
            isActive={isNodeActive('Assignment sent')}
            isCompleted={isNodeCompleted('Assignment sent')}
            filterId={filterId}
          />

          {/* ================================================================= */}
          {/* LANE 3 SEQUENTIAL NODES & ARROWS */}
          {/* ================================================================= */}
          {/* Start shift */}
          <SvgEventNode
            x={120}
            y={479}
            title="Start shift"
            icon={Play}
            type="start"
            isActive={isNodeActive('Start shift')}
            isCompleted={isNodeCompleted('Start shift')}
            filterId={filterId}
          />
          <path d="M171.9,504 L279,504" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Operator logs in */}
          <SvgActivityNode
            x={281}
            y={468}
            title="Operator logs in"
            icon={LogIn}
            isActive={isNodeActive('Operator logs in')}
            isCompleted={isNodeCompleted('Operator logs in')}
            filterId={filterId}
          />
          <path d="M419,504 L486,504" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Set availability */}
          <SvgActivityNode
            x={486}
            y={468}
            title="Set availability"
            icon={ToggleRight}
            isActive={isNodeActive('Set availability')}
            isCompleted={isNodeCompleted('Set availability')}
            filterId={filterId}
          />
          <path d="M624,504 L733.3,504" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Receive request */}
          <SvgEventNode
            x={735}
            y={479}
            title="Receive request"
            icon={Bell}
            type="intermediate"
            isActive={isNodeActive('Receive request')}
            isCompleted={isNodeCompleted('Receive request')}
            filterId={filterId}
          />
          <path d="M785.4,504 L938,504" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Accept or decline? (Gateway) */}
          <SvgGatewayNode
            x={940}
            y={479}
            title="Accept or decline?"
            icon={HelpCircle}
            isActive={isNodeActive('Accept or decline?')}
            filterId={filterId}
          />

          {/* Decline Branch */}
          <path d="M986.3,501 L1099,501" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />
          <g transform="translate(1024, 486)">
            <rect x="0" y="0" width="48" height="16" fill="#ffffff" rx="3" stroke="#242424" strokeWidth="0.75" />
            <text x="24" y="12" fill="#dc2626" fontSize="9" fontWeight="bold" textAnchor="middle">
              Decline
            </text>
          </g>

          {/* Decline request */}
          <SvgActivityNode
            x={1101}
            y={468}
            title="Decline request"
            icon={XCircle}
            isActive={isNodeActive('Decline request')}
            isCompleted={isNodeCompleted('Decline request')}
            filterId={filterId}
          />
          <path d="M1239,504 L1348,504" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Request declined */}
          <SvgEventNode
            x={1350}
            y={479}
            title="Request declined"
            icon={Slash}
            type="intermediate"
            isActive={isNodeActive('Request declined')}
            isCompleted={isNodeCompleted('Request declined')}
            filterId={filterId}
          />

          {/* Accept Branch */}
          <path
            d="M983,512 L1046,512 L1046,644 L1099,644"
            fill="none"
            stroke="#242424"
            strokeWidth="1.2"
            markerEnd={`url(#arrow-black-${filterId})`}
          />
          <g transform="translate(1026, 555)">
            <rect x="0" y="0" width="45" height="16" fill="#ffffff" rx="3" stroke="#242424" strokeWidth="0.75" />
            <text x="22.5" y="12" fill="#059669" fontSize="9" fontWeight="bold" textAnchor="middle">
              Accept
            </text>
          </g>

          {/* Navigate to patient */}
          <SvgActivityNode
            x={1101}
            y={608}
            title="Navigate to patient"
            icon={Compass}
            isActive={isNodeActive('Navigate to patient')}
            isCompleted={isNodeCompleted('Navigate to patient')}
            filterId={filterId}
          />
          <path d="M1239,648 L1306,648" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Patient picked up */}
          <SvgActivityNode
            x={1306}
            y={608}
            title="Patient picked up"
            icon={UserCheck}
            isActive={isNodeActive('Patient picked up')}
            isCompleted={isNodeCompleted('Patient picked up')}
            filterId={filterId}
          />

          {/* Arrow to Navigate to hospital */}
          <path
            d="M1444,644 L1455,644 L1455,504 L1510,504"
            fill="none"
            stroke="#242424"
            strokeWidth="1.2"
            markerEnd={`url(#arrow-black-${filterId})`}
          />

          {/* Navigate to hospital */}
          <SvgActivityNode
            x={1510}
            y={468}
            width={141}
            title="Navigate to hospital"
            icon={Map}
            isActive={isNodeActive('Navigate to hospital')}
            isCompleted={isNodeCompleted('Navigate to hospital')}
            filterId={filterId}
          />
          <path d="M1651,508 L1717,508" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Complete trip */}
          <SvgActivityNode
            x={1717}
            y={468}
            title="Complete trip"
            icon={Flag}
            isActive={isNodeActive('Complete trip')}
            isCompleted={isNodeCompleted('Complete trip')}
            filterId={filterId}
          />
          <path d="M1855,504 L1964,504" fill="none" stroke="#242424" strokeWidth="1.2" markerEnd={`url(#arrow-black-${filterId})`} />

          {/* Trip completed (End Event) */}
          <SvgEventNode
            x={1966}
            y={479}
            title="Trip completed"
            icon={CheckCircle}
            type="end"
            isActive={isNodeActive('Trip_done_ambulance')}
            isCompleted={isNodeCompleted('Trip_done_ambulance')}
            filterId={filterId}
          />
        </svg>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// SVG Node Sub-components
// -----------------------------------------------------------------------------

function SvgActivityNode({
  x,
  y,
  width = 138,
  height = 72,
  title,
  icon: Icon,
  badge,
  isActive,
  isCompleted,
  filterId,
}: {
  x: number;
  y: number;
  width?: number;
  height?: number;
  title: string;
  icon: typeof AlertTriangle;
  badge?: string;
  isActive: boolean;
  isCompleted: boolean;
  filterId: string;
}) {
  return (
    <g transform={`translate(${x}, ${y})`} filter={isActive ? `url(#glow-${filterId})` : undefined}>
      <rect
        width={width}
        height={height}
        rx="6"
        fill={isCompleted ? '#f0fdf4' : isActive ? '#fffbeb' : '#ffffff'}
        stroke={isActive ? '#e52421' : isCompleted ? '#16a34a' : '#242424'}
        strokeWidth={isActive ? '2.5' : '0.85'}
      />
      {/* Icon */}
      <foreignObject x="8" y="8" width="18" height="18">
        <Icon className={`h-4 w-4 ${isActive ? 'text-comic-red' : isCompleted ? 'text-emerald-700' : 'text-slate-700'}`} />
      </foreignObject>
      {/* Badge */}
      {badge && (
        <text x={width - 8} y="16" fill="#1c1c1c" fontSize="9" fontWeight="bold" textAnchor="end">
          {badge}
        </text>
      )}
      {/* Label */}
      <text
        x={width / 2}
        y={height / 2 + 8}
        fill="#1c1c1c"
        fontSize="12"
        fontWeight="500"
        textAnchor="middle"
      >
        {title}
      </text>
    </g>
  );
}

function SvgEventNode({
  x,
  y,
  title,
  icon: Icon,
  type,
  isActive,
  isCompleted,
  filterId,
}: {
  x: number;
  y: number;
  title: string;
  icon: typeof AlertTriangle;
  type: 'start' | 'intermediate' | 'end';
  isActive: boolean;
  isCompleted: boolean;
  filterId: string;
}) {
  return (
    <g transform={`translate(${x}, ${y})`} filter={isActive ? `url(#glow-${filterId})` : undefined}>
      <circle
        cx="25"
        cy="25"
        r="24"
        fill={isCompleted ? '#f0fdf4' : isActive ? '#fffbeb' : '#ffffff'}
        stroke={isActive ? '#e52421' : isCompleted ? '#16a34a' : '#242424'}
        strokeWidth={type === 'end' ? '2.5' : '0.85'}
      />
      {type === 'end' && (
        <circle cx="25" cy="25" r="20" fill="none" stroke="#242424" strokeWidth="0.85" />
      )}
      <foreignObject x="15" y="15" width="20" height="20">
        <Icon className={`h-5 w-5 ${isActive ? 'text-comic-red' : isCompleted ? 'text-emerald-700' : 'text-slate-800'}`} />
      </foreignObject>
      <text
        x="25"
        y="62"
        fill="#1c1c1c"
        fontSize="10"
        fontWeight="500"
        textAnchor="middle"
      >
        {title}
      </text>
    </g>
  );
}

function SvgGatewayNode({
  x,
  y,
  title,
  icon: Icon,
  isActive,
  filterId,
}: {
  x: number;
  y: number;
  title: string;
  icon: typeof AlertTriangle;
  isActive: boolean;
  filterId: string;
}) {
  return (
    <g transform={`translate(${x}, ${y})`} filter={isActive ? `url(#glow-${filterId})` : undefined}>
      <rect
        x="7"
        y="7"
        width="36"
        height="36"
        transform="rotate(45, 25, 25)"
        fill={isActive ? '#fffbeb' : '#ffffff'}
        stroke={isActive ? '#e52421' : '#242424'}
        strokeWidth={isActive ? '2.5' : '0.85'}
      />
      <foreignObject x="15" y="15" width="20" height="20">
        <Icon className={`h-5 w-5 ${isActive ? 'text-comic-red' : 'text-slate-800'}`} />
      </foreignObject>
      <text
        x="25"
        y="62"
        fill="#1c1c1c"
        fontSize="10"
        fontWeight="500"
        textAnchor="middle"
      >
        {title}
      </text>
    </g>
  );
}
